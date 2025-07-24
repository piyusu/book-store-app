import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface userState{
    user: any | null;
    isEmailVerified: boolean;
    isLoginDialogOpen: boolean;
    isLoggedIn: boolean;
}


const initialState: userState={
    user: null,
    isEmailVerified: false,
    isLoginDialogOpen: false,
    isLoggedIn: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser:(state, action: PayloadAction<any>) => {
            state.user = action.payload;
            // state.isLoggedIn = true;
        },
        setIsEmailVerified:(state, action: PayloadAction<any>) => {
            state.isEmailVerified = action.payload;
        },
        logout:(state) => {
            state.user = null;
            state.isEmailVerified = false;
            state.isLoggedIn = false;
        },
        toggledLoginDialog:(state) => {
            state.isLoginDialogOpen = !state.isLoginDialogOpen;
        },
        authStatus:(state) => {
            state.isLoggedIn = true;
        }
    }
});
export const {setUser, setIsEmailVerified, logout, toggledLoginDialog, authStatus} = userSlice.actions;
export default userSlice.reducer;