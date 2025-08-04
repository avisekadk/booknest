import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        loading: false,
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(n => n._id !== action.payload);
        }
    }
});

export const { setNotifications, removeNotification } = notificationSlice.actions;

export const fetchMyNotifications = () => async (dispatch) => {
    try {
        const { data } = await axios.get("http://localhost:4000/api/v1/notification/my-notifications", { withCredentials: true });
        dispatch(setNotifications(data.notifications));
    } catch (error) {
        console.error("Failed to fetch notifications");
    }
};

export const deleteNotification = (id) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:4000/api/v1/notification/${id}`, { withCredentials: true });
        dispatch(removeNotification(id));
        toast.success("Notification cleared.");
    } catch (error) {
        toast.error("Failed to clear notification.");
    }
};

export default notificationSlice.reducer;