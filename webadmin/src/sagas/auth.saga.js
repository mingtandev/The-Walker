import userApi from "../api/userApi";
import {
  call,
  cancel,
  cancelled,
  fork,
  put,
  take,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";

import { push } from "react-router-redux";

import store from "../store";

import jwt_decode from "jwt-decode";

import * as actionType from "../actions/actionDefine";
import * as authAction from "../actions/authAction";

import history from "../history";

export async function callApi(email, password) {
  console.log(email, password);
  return new Promise(async (resolve, reject) => {
    userApi
      .signIn({ email, password })
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((error) => reject(error));
  });
}

export function* executeLogin(action) {
  try {
    const { email, password } = action.payload;

    // const res = yield call(callApi, email, password);

    // const user = jwt_decode(res.token);
    // if (user.roles !== "admin") {
    //   console.log("not admin");
    //   return;
    // }

    // yield put(authAction.signInSuccess(user, res.token));
    // put(push("/dashboard")),

    console.log("LOGIN SUCCESSSSSSSSSSSSSSSSSSSSSS");
    history.push("/dashboard");
    console.log("LOGIN SUCCESSSSSSSSSSSSSSSSSSSSSS");
  } catch (error) {
    console.log(error);
  }
}

export function* watchLogin() {
  yield takeLatest(actionType.LOGIN_REQUEST, executeLogin);
}
