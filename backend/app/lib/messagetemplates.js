"use strict";

module.exports = {
  acceptSalonRequest: {
    subject: "Salon Activation Successful",
    message:
      '<div style="background:white; height: auto; width:100%;color:purple;border:1px solid purple; border-radius: 10px;padding: 1em;text-align: center;"><div class="content"><p>Your request for salon activation has been accepted. Please login<astyle="font-weight:600; font-family:Regular Lato; color:purple"href="https://bookapp.ch/salon">here</a></p></div></div>'
  },

  rejectSalonRequest: {
    subject: "Salon Activation Failed",
    message:
      "Your request for salon activation has been rejected. Please contact admin"
  },

  accountSuspended: {
    subject: "Salon Account Suspended",
    message:
      "Your account has been suspended temporarily. Please renew your subscription"
  },

  refundInWallet: {
    subject: "Refund Notification",
    message: "Your total amount will be refunded in your wallet"
  },

  bookingDeclined: {
    subject: "Booking Declined",
    message:
      "Your booking has been declined by the salon. Please try another salon"
  }
};
