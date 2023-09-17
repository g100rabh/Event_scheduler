import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    userEmail: localStorage.getItem('userEmail'),
    user: localStorage.getItem('user'),
    eventList: [],
    editId: null,

}

const listSlice = createSlice({
    name: "listSlice",
    initialState,
    reducers: {
        setUserEmail(state, action) {
            state.userEmail = action.payload;
            localStorage.setItem('userEmail', action.payload)
        },
        setEventList(state, action){
            state.eventList = action.payload; 
        },
        setUserTrue(state){
            state.user = true;
            localStorage.setItem('user',true)
        },
        setUserFalse(state){
            state.user = false;
        },
        clearAllStore(state){
            localStorage.clear();
        },
        setEditId(state, action){
            state.editId = action.payload;
        },
        removeEditId(state){
            state.editId = null;
        }
    }
})

export const listAction = listSlice.actions;

export default listSlice.reducer;