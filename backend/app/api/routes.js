module.exports = function (express) {
  var router = express.Router();
  // user
  require("./modules/user/user_routes")(router);
  require("./modules/hospital/hospital_routes")(router);
  require("./modules/patient/patient_routes")(router);
  require("./modules/video/video_routes")(router);

  return router;
};
