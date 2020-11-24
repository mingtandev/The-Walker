import React from "react";
import ReduxToastr from "react-redux-toastr";

export default function Notification() {
  return (
    <ReduxToastr
      timeOut={7000}
      newestOnTop={false}
      preventDuplicates
      position="top-right"
      getState={(state) => state.toastr} // This is the default
      transitionIn="bounceIn"
      transitionOut="bounceOut"
      progressBar
      closeOnToastrClick
    />
  );
}
