"use strict";

const config = {
  local: {
    port: 4001,
    db: {
      user: "curio",
      password: "curioertgf95123",
      url: "mongodb://40.121.3.216:27017/curio",
    },
    baseUrl: "http://localhost:4001/",
    backendBaseUrl: "http://localhost:4001/",
    imageBaseUrl: "http://172.10.230.180:4001/",
    frontendURL: "http://localhost:1234/",
    env: "local",
    smtp: {
      username: "welcome@curiodtx.com",
      password: "welcome123!",
      mailUsername: "",
      host: "smtpout.secureserver.net",
      mailUsername: "",
      verificationMail: "",
    },
  },

  staging: {
    port: 5015,
    db: {
      user: "curioapp",
      password: "hjkui78",
      url: "mongodb://54.190.192.105:27017/curioapp",
    },
    baseUrl: "	http://54.190.192.105:5015/",
    frontendURL: "http://54.190.192.105:5015/",
    backendBaseUrl: "http://54.190.192.105:5015/",
    imageBaseUrl: "http://54.190.192.105:5015/",
    env: "staging",
    smtp: {
      service: "gmail",
      username: "salon.sdn@gmail.com",
      password: "Smartdata@123",
      mailUsername: "",
      host: "gmail.com",
      mailUsername: "",
      verificationMail: "",
    },
  },
  prod: {
    port: 8080,
    db: {
      user: "curio",
      password: "curioertgf95123",
      url: "mongodb://40.121.3.216:27017/curio",
    },
    baseUrl: "http://40.121.3.216:8080/",
    backendBaseUrl: "http://40.121.3.216:8080/",
    imageBaseUrl: "http://40.121.3.216:8080/",
    frontendURL: "http://40.121.3.216:8080/",
    env: "prod",
    smtp: {
      username: "welcome@curiodtx.com",
      password: "welcome123!",
      mailUsername: "",
      host: "smtpout.secureserver.net",
      mailUsername: "",
      verificationMail: "",
    },
  },
};
module.exports.get = function get(env) {
  return config[env] || config.default;
};
