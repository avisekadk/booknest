import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        error: null,
        message: null,
        user: null,
        isAuthenticated: false,
    },
    reducers: {
        registerRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;

        },
        registerSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;

        },
        registerFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        otpVerificationRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;

        },
        otpVerificationSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user;

        },
        otpVerificationFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        loginRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;

        },
        loginSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user;

        },
        loginFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        logoutRequest(state) {
            state.loading = true;
            state.message = null;
            state.error = null;
        },
        logoutSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.message = action.payload;
            state.isAuthenticated = false;
            state.user = null;
        },
        logoutFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.user = null;
        },

        getUserRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;

        },
        getUserSuccess(state, action) {
            state.loading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        getUserFailed(state, action) {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = action.payload;
        },

        forgotPasswordRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;

        },
        forgotPasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;

        },
        forgotPasswordFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },


        resetPasswordRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;

        },
        resetPasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.user = action.payload.user;
            state.isAuthenticated = true;

        },
        resetPasswordFailed(state,action) {
            state.loading = false;
            state.error = action.payload;
        },


        updatePasswordRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;

        },
        updatePasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload;

        },
        updatePasswordFailed(state,action) {
            state.loading = false;
            state.error = action.payload;
        },

        resetAuthSlice(state) {
            state.error = null;
            state.loading = false;
            state.message = null;
            // state.user = state.user;
            // state.isAuthenticated = state.isAuthenticated;

        }

    },
});

export const resetAuthSlice = () => (dispatch) => {
    dispatch(authSlice.actions.resetAuthSlice())
}


export const register = (data) => async (dispatch) => {
    dispatch(authSlice.actions.registerRequest())
    await axios.post("http://localhost:4000/api/v1/auth/register", data, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",

        }
    }).then(res => {
        dispatch(authSlice.actions.registerSuccess(res.data))
    }).catch(error => {
        dispatch(authSlice.actions.registerFailed(error.response.data.message));
    });
};


export const otpVerification = ({ email, otp }) => async (dispatch) => {
    dispatch(authSlice.actions.otpVerificationRequest())
    await axios.post("http://localhost:4000/api/v1/auth/verify-otp", { email, otp }, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",

        }
    }).then(res => {
        dispatch(authSlice.actions.otpVerificationSuccess(res.data))
    }).catch(error => {
        dispatch(authSlice.actions.otpVerificationFailed(error.response.data.message));
    });
};

export const login = (data) => async (dispatch) => {
    dispatch(authSlice.actions.loginRequest())
    await axios.post("http://localhost:4000/api/v1/auth/login", data, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",

        }
    }).then(res => {
        dispatch(authSlice.actions.loginSuccess(res.data))
    }).catch(error => {
        dispatch(authSlice.actions.loginFailed(error.response.data.message));
    });
};

export const logout = () => async (dispatch) => {
  dispatch(authSlice.actions.logoutRequest());
  try {
    const res = await axios.post("http://localhost:4000/api/v1/auth/logout", {}, {
      withCredentials: true,
    });
    dispatch(authSlice.actions.logoutSuccess(res.data.message));
    dispatch(authSlice.actions.resetAuthSlice());
  } catch (error) {
    // Defensive check to avoid accessing undefined
    if (error.response) {
      console.error("Logout error:", error.response.data);
      dispatch(authSlice.actions.logoutFailed(error.response.data.message));
    } else {
      console.error("Logout error:", error.message || error);
      dispatch(authSlice.actions.logoutFailed(error.message || "Network error"));
    }
  }
};


export const getUser = () => async (dispatch) => {
    dispatch(authSlice.actions.getUserRequest())
    await axios.get("http://localhost:4000/api/v1/auth/me", {
        withCredentials: true,

    }).then(res => {
        dispatch(authSlice.actions.getUserSuccess(res.data))
    }).catch(error => {
        dispatch(authSlice.actions.getUserFailed(error.response.data.message));
    });
};

export const forgotPassword = (email) => async (dispatch) => {
    dispatch(authSlice.actions.forgotPasswordRequest())
    await axios.post("http://localhost:4000/api/v1/auth/password/forgot", { email }, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",

        }
    }).then(res => {
        dispatch(authSlice.actions.forgotPasswordSuccess(res.data))
    }).catch(error => {
        dispatch(authSlice.actions.forgotPasswordFailed(error.response.data.message));
    });
};

export const resetPassword = ({ password, confirmPassword, token }) => async (dispatch) => {
  console.log("Token inside authSlice:", token); // Should show actual token

  try {
    const res = await axios.put(
      `http://localhost:4000/api/v1/auth/password/reset/${token}`,
      { password, confirmPassword },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    dispatch(authSlice.actions.resetPasswordSuccess(res.data));
  } catch (error) {
    dispatch(
      authSlice.actions.resetPasswordFailed(
        error.response?.data?.message || error.message
      )
    );
  }
};



export const updatePassword = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updatePasswordRequest());
  try {
    const res = await axios.put(
      `http://localhost:4000/api/v1/auth/password/update`,
      data,
      {
        withCredentials: true,
        headers: {
          // Don't set Content-Type manually — let Axios handle it for FormData
        },
      }
    );
    dispatch(authSlice.actions.updatePasswordSuccess(res.data.message));
  } catch (error) {
    dispatch(
      authSlice.actions.updatePasswordFailed(
        error.response?.data?.message || "Password update failed"
      )
    );
  }
};


export default authSlice.reducer;