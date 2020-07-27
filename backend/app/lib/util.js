"use strict";

var jwt = require("jsonwebtoken");
let jwtKey = "saloncrm";

var Constant = require("../config/constant.js");
const commonQuery = require("../lib/commonQuery");
var mongoose = require("mongoose");

// const config = require('../config/config.js').get(process.env.NODE_ENV);
module.exports = {
  ensureAuthorized: ensureAuthorized,
};

/* Function is use check authorization of BASEURL.
 * @access private
 * @return json
 * Created by Trisha Deepam
 * @smartData Enterprises (I) Ltd
 * Created Date
 */

function ensureAuthorized(req, res, next) {
  //console.log("REQUEST HEADER", req.headers);
  var bearerToken;
  var bearerHeader = req.headers["authorization"];
  if (bearerHeader !== "undefined") {
    var bearer = bearerHeader; //bearerHeader.split(" ");

    //bearerToken = bearer[1];
    jwt.verify(bearer, jwtKey, function (err, decoded) {
      req.user = decoded;
      if (err) {
        console.log("false token");
        return res.send({
          code: Constant.AUTH_CODE,
          message: Constant.INVALID_TOKEN,
        });
      } else {
        console.log("match");
      }
      next();
    });
  } else {
    return res.send({
      code: Constant.AUTH_CODE,
      message: Constant.TOKEN_ERROR,
    });
  }
}
