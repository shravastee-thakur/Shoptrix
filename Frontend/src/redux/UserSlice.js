import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  accessToken: null,
  isVerified: false,
  name: null,
  role: null,
};

export const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setIsVerified: (state, action) => {
      state.isVerified = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    logout: (state) => {
      state.userId = null;
      state.accessToken = null;
      state.isVerified = false;
      state.name = null;
      state.role = null;
    },
  },
});

export const { setUserId, setAccessToken, setIsVerified, setName, logout } =
  userSlice.actions;
export default userSlice.reducer;
