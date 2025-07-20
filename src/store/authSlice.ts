import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  code: number;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  userGender: string;
  userEmail: string;
  userPhone: string;
  userAddress: string;
  userAddressPincode: number;
  lockedByAdmin: boolean;
  roles: string[];
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{
        user: any;
        jwtToken: string | null;
}>) => {
      state.token = action.payload.jwtToken;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
