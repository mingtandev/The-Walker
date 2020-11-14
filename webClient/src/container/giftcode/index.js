import React, { useState } from "react";
import giftcodeApi from "../../api/giftcodeApi";
import { toastr } from "react-redux-toastr";
import "../../components/auth/form.scss";

function GiftcodeForm() {
  const handleSubmitCode = (e) => {
    e.preventDefault();
    const { giftcode } = e.target;
    console.log(giftcode.value);
    try {
      giftcodeApi.useOne(giftcode.value).then((res) => {
        console.log(res);
        if (res) {
          if (res.msg === "success")
            toastr.success("Successfully", "Check Your Items Now");
          else toastr.error("Oops!", "Code does not exist or has been Expired");
          return;
        }
        toastr.error("Please Login and Try again!");
      });
    } catch (error) {
      console.log("error in code: ", error);
    }
  };

  return (
    <div className="form__container">
      <div className="form">
        <form onSubmit={handleSubmitCode}>
          <div className="form__input">
            <input
              type="text"
              name="giftcode"
              placeholder="Enter Giftcode..."
            />
            <span class="form__input--focus"></span>
          </div>
          <input type="submit" value="GET PRIZE" />
        </form>
      </div>
    </div>
  );
}

export default GiftcodeForm;
