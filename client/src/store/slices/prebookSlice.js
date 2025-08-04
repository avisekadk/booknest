import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const prebookSlice = createSlice({
    name: "prebook",
    initialState: {
        loading: false,
        error: null,
        prebookings: [],
        message: null,
    },
    reducers: {
        fetchPrebookingsRequest(state) {
            state.loading = true;
        },
        fetchPrebookingsSuccess(state, action) {
            state.loading = false;
            state.prebookings = action.payload;
        },
        fetchPrebookingsFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetPrebookSlice(state) {
            state.error = null;
            state.message = null;
        }
    },
});

export const { resetPrebookSlice } = prebookSlice.actions;

export const fetchMyPrebookings = () => async (dispatch) => {
    dispatch(prebookSlice.actions.fetchPrebookingsRequest());
    try {
        const { data } = await axios.get("http://localhost:4000/api/v1/prebook/my-prebookings", { withCredentials: true });
        dispatch(prebookSlice.actions.fetchPrebookingsSuccess(data.prebookings));
    } catch (error) {
        dispatch(prebookSlice.actions.fetchPrebookingsFailure(error.response?.data?.message || "Could not fetch pre-bookings."));
    }
};

export default prebookSlice.reducer;