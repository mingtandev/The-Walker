import React from "react";
import MessengerCustomerChat from "react-messenger-customer-chat";

function MessengerChat() {
  return (
    <div>
      <MessengerCustomerChat
        pageId={process.env.REACT_APP_FB_PAGEID}
        appId={process.env.REACT_APP_FB_APPID}
      />
    </div>
  );
}

export default MessengerChat;
