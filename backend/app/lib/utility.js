"use strict";
/*
 * Utility - utility.js
 * Author: smartData Enterprises
 * Date: 28th Nov 2019
 */
// var config = require('../../config/config').get(process.env.NODE_ENV || 'staging');

var utility = {};
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

utility.hashPassword = function(password) {
  if (password) {
    return bcrypt.hashSync(password, salt);
  }
  return "";
};

utility.uuid = {
  uuid: require("node-uuid"),
  v1: function() {
    return this.uuid.apply(this, arguments); //.v1()
  }
};
utility.getUuid = function() {
  return new Promise((resolve, reject) => {
    try {
      let newUuid = uuidv1();
      resolve(newUuid);
    } catch (error) {}
  });
};

utility.generateRandomString = function() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

module.exports = utility;
