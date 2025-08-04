import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInfo = {
  _id: string;
  email: string;
  fullName: string;
  dob: string;
  phoneNumber: string;
  gender: string;
  points: number;
  roleId: number;
  gameTicketCount: number;
  isDeactivated: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

type UserState = {
  token: string | null;
  info: UserInfo | null;
};

const initialState: UserState = {
  token: null,
  info: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.info = action.payload;
    },
    clearUser: (state) => {
      state.token = null;
      state.info = null;
    },
  },
});

export const { setToken, setUserInfo, clearUser } = userSlice.actions;
export default userSlice.reducer;
