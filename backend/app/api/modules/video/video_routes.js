module.exports = function (router) {
  var video = require("./controller/video_ctrl");
  var utils = require("../../../lib/util");
  var middlewares = [utils.ensureAuthorized];

  router.post("/get-video-token", video.generateToken);
  router.post("/send-call-notification", video.notificationToPatientForCall);
  router.post("/check-timing", video.checkTiming);
  router.post(
    "/send-video-call-notification",
    video.sendNotificationToCareTaker
  );
  router.post(
    "/send-miss-call-notification",
    video.missedCallNotificationPatientToDoctor
  );

  router.post("/get-miss-call-notification", video.getMissCallNotification);
  router.post(
    "/decline-video-call-doctor",
    video.declineVideoCallDoctorToPatient
  );
  router.post(
    "/decline-video-call-patient",
    video.declineVideoCallPatientToDoctor
  );

  router.post("/add-group-session", video.createGroupSession);

  return router;
};
