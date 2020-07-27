"use strict";

const Validators = {};

Validators.emailValidate = function emailValidate(data) {
  return new Promise(function (resolve, reject) {
    const emailRegxPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (emailRegxPattern.test(data === true)) {
      resolve(true);
    } else if (emailRegxPattern.test(data === false)) {
      resolve(false);
    }
  });
};

module.exports = Validators;
