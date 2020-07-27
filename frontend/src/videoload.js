var vidyoConnector;
function onVidyoClientLoaded(status) {
  console.log("hello");
  switch (status.state) {
    case "READY":
      VC.CreateVidyoConnector({
        viewId: "connected-video-chat",
        viewStyle: "VIDYO_CONNECTORVIEWSTYLE_Default",
        remoteParticipants: 10,
        logFileFilter: "warning all@VidyoConnector info@VidyoClient",
        logFileName: "",
        userData: "",
      })
        .then((vc) => {
          console.log("VidyoClient Success", vc);
          vidyoConnector = vc;
          console.log("VCC", vidyoConnector);
        })
        .catch((error) => {
          console.log("VidyoClient failed", error);
          onVidyoClientLoaded(status);
        });
      break;
    case "RETRYING": // The library operating is temporarily paused
      console.log("RETRYING");
      break;
    case "FAILED": // The library operating has stopped
      console.log("FAILED");
      break;
    case "FAILEDVERSION":
      console.log("FAILEDVERSION");
      break;
    case "NOTAVAILABLE": // The library is not available
      console.log("NOTAVAILABLE");
      break;
  }
  // console.log("ss", vidyoConnector);
  return true; // Return true to reload the plugins if not available
}
