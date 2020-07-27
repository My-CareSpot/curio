module.exports = function (router) {
  var user = require("./controllers/user_ctrl");
  var utils = require("../../../lib/util");
  var middlewares = [utils.ensureAuthorized];
  var chat = require("../../../lib/chat");

  router.post("/attachment-upload", chat.attachImage);

  router.post("/superadminlogin", user.superadminlogin);
  router.post("/registersuperadmin", user.SuperAdminRegister);
  router.post("/gethospitallist", user.gethospitallist);

  router.post("/register", user.registerHospital);
  router.post("/login", user.loginHospital);
  router.post("/add-address", user.addAddress);
  router.post("/edit-user", user.editUserDetails);
  router.post("/delete-user", user.deleteUser);
  router.post("/get-user-detail", user.getUserDetails);
  router.post("/add-medical-history", user.addMedicalHistory);
  router.post("/add-social-history", user.addSocialHistory);
  router.post("/add-immunization-history", user.addImmunizationHistory);
  router.post(
    "/add-many-immunization-history",
    user.addManyImmunizationHistory
  );
  router.post("/add-medication-history", user.addMedicationHistory);
  router.post("/add-family-history", user.addFamilyHistory);
  router.post("/add-many-family-history", user.addManyFamilyHistory);
  router.post("/update-medical-history", user.updateMedicalHistory);
  router.post("/update-social-history", user.updateSocialHistory);
  router.post("/update-immunization-history", user.updateImmunizationHistory);
  router.post("/check-user-data", user.checkUserData);
  router.post("/update-medication-history", user.updateMedicationHistory);
  router.post("/update-family-history", user.updateFamilyHistory);
  router.post("/change-password", user.changePassword);
  router.post("/image-upload", user.addImage);
  router.post("/change-preference", user.changeUserNotificationPrefrences);
  router.post("/notification-setting", user.notificationSetting);

  return router;
};
