import { configureStore } from '@reduxjs/toolkit';
import permissionReducer from './Permission_Slice';
import authReducer from "./permisionForOwner";


const store = configureStore({
  reducer: {
    permissions: permissionReducer,
     auth: authReducer,
  },
});

export default store;