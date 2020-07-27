'use strict';

const mongoose = require("mongoose");
const chatRoomModel = require('../api/modules/hospital/model/chattroom_schema');
const chatmessageModel = require("../api/modules/hospital/model/chatmessage_schema")
const commonQuery = require('./commonQuery');
var hospital = require("../api/modules/hospital/controllers/hospital_ctrl");
const Response = require("./response_handler");
const constant = require("../config/constant.js");

module.exports = {
    socketMethod: socketMethod,
    getAllMessage:getAllMessage,
    attachImage:attachImage
}

function attachImage(req, res) {
    async function attachImage() {
      try {
        if (req.files && req.body && req.body.roomId) {
          let imagePath = await commonQuery.fileUpload(
            Math.random(new Date()) +req.files["file"]["name"],
            req.files["file"]["data"]
          );
          if (imagePath.  status) {
            let chatObj = {
              message: {
                _id: mongoose.Types.ObjectId(req.body._id),
                createdAt: new Date(),
                image: imagePath.url,
                user: JSON.parse(req.body.user)
              }
            }
            imagePath.createdAt = chatObj.message.createdAt;
            imagePath._id = chatObj.message._id;
            imagePath.image = chatObj.message.image;
            imagePath.imageType = req.body.imageType;
            imagePath.imageName = req.files["file"]["name"];
            if (imagePath) {
              res.json(
                Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS,imagePath)
              );
            }
  
          }
          else {
            res.json(
              Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS, null)
            );
          }
        }
      } catch (error) {
        res.json(
          Response(constant.ERROR_CODE, constant.REQUIRED_FIELDS_MISSING, null)
        );
      }
    }
    attachImage().then(function () { });
  }

function socketMethod(io) {
    async function socketMethod() {
        try {
            // const io = require("socket.io").listen(server);

            // const io = req.app.get("io")

            io.on('connection', async (socket) => {    
                
                socket.on('join', async (data) => {
                    
                    let querObj = {
                        user1_id: { $in: [data.user1_id, data.user2_id] },
                        user2_id: { $in: [data.user1_id, data.user2_id] }
                    }
                    
                    let room = await commonQuery.findAll(chatRoomModel, querObj);
                    let roomId = "";
                    if (room.length == 0) {
                        let insersetRoom = await commonQuery.InsertIntoCollection(chatRoomModel, data);
                        roomId = JSON.parse(JSON.stringify(insersetRoom._id))
                    }
                    if (room.length == 1) {
                        roomId = JSON.parse(JSON.stringify(room[0]._id));
                        let chatCond = {
                            room_id:roomId
                        }
                        let chatHistory = await commonQuery.findoneData(chatmessageModel,chatCond);
                        socket.emit("chat History",chatHistory)
                    }
                    else {
                        console.log("error while getting room id")
                    }
                    if (roomId) {
                        socket.join(roomId);
                        socket.emit('room Id',roomId);
                        socket.broadcast.to(roomId).emit("new user joined", { user: roomId, message: "has joined" });
                    }
                })
                socket.on("leave", (data) => {
                    socket.broadcast.to(data.room).emit("left room", { user: data.user, message: "has left" });
                    socket.leave(data.room)
                })
                socket.on("message", async (data) => {
                    // let type = data.type || "web";
                    // let chatObj = {
                    //     message:{
                    //     _id:mongoose.Types.ObjectId(data._id),
                    //     createdAt:new Date(),
                    //     text:data.text||null,
                    //     image:data.image||null,
                    //     imageType:data.imageType||null,
                    //     imageName:data.imageName||null,
                    //     user:data.user
                    // }
                    // }
                    // let checkObj={
                    //     room_id:mongoose.Types.ObjectId(data.roomId)
                    // }
                    // let result = await commonQuery.pushChatMessage(chatmessageModel,checkObj,chatObj);
                    // let messageObj = {
                    //     _id:data._id,
                    //     text:data.text||null,
                    //     image:data.image||null,
                    //     imageType:data.imageType||null,
                    //     imageName:data.imageName||null,
                    //     createdAt:new Date(),
                    //     user:data.user,
                    //     roomId:data.roomId
                    // }
                    //     io.in(data.roomId).emit("new message",messageObj);

                   if(data && data.roomId){
                     let checkObj={
                        room_id:mongoose.Types.ObjectId(data.roomId)
                    }
                    let chatObj = {
                      message:{
                        data:data.data
                      }                      
                    }

                    let result = await commonQuery.pushChatMessage(chatmessageModel,checkObj,chatObj);

                    io.in(data.roomId).emit("new message",data.data);

                   }
                    
                })

            });


        }
        catch (err) {
            console.log("error is socketMethod")
        }
    }
    socketMethod().then(res => { })
}

function getAllMessage(req,res){
    async function getAllMessage(){
        try {
            if(req.body.user_id){
                let userChatMessage = await chatRoomModel.aggregate([
                    {
                        $match:{ $or: [{ user2_id: mongoose.Types.ObjectId(req.body.user_id) },
                             { user1_id: mongoose.Types.ObjectId(req.body.user_id)}] }
                    },
                    {
                        $lookup:{
                           from:"chatmessages",
                           let:{"roomId":"$_id"},
                           pipeline:[
                            {$match:{$expr:{$eq:["$room_id" , "$$roomId"]}}}
                            
                           ],
                           as:"chatmessage"       
                            
                         }
                    },
                    {"$unwind":"$chatmessage"},
                    {
                        "$project":{
                            "user1_name" :1,
                            "user2_name" : 1,
                            "user1_id" :1,
                            "user2_id" :1,
                            "roomId":"$chatmessage.room_id",
                            "lastMessage":{ $arrayElemAt: [ "$chatmessage.message", -1 ] },
                            "updatedAt" :"$chatmessage.updatedAt",
                            }
                    }
                ]).exec();

                if (userChatMessage && userChatMessage.length) {
                  userChatMessage.map(element=>{
                    let user1 = element.user1_id.toString();
                    let user2 = element.user2_id.toString();
                    if(req.body.user_id != user1){
                      element.toUserId = user1;
                      element.toUserName = element.user1_name;
                      delete element.user1_name;
                      delete element.user1_id;
                      delete element.user2_id;
                      delete element.user2_name;

                    }
                    if(req.body.user_id != user2){
                      element.toUserId = user2;
                      element.toUserName = element.user2_name;
                      delete element.user1_name;
                      delete element.user1_id;
                      delete element.user2_id;
                      delete element.user2_name;

                    }
                  })
                    res.json(
                      Response(constant.SUCCESS_CODE, constant.UPDATE_SUCCESS, userChatMessage)
                    );
                  }
                  else {
                    res.json(
                      Response(constant.ERROR_CODE, constant.FAILED_TO_PROCESS)
                    );
                  }

            }

        }
        catch (err){
            console.log("Error in getAllMessage");
        }
        
    }
    getAllMessage().then(response=>{})
}