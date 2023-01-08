import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    classFilter: '',
    locoFilter: ''
}

export const homeFilterSlice = createSlice({
    name: 'homeFilter',
    initialState,
    reducers: {
        updateData: (state, action) => {
            const { classFilter, locoFilter } = action.payload;
            state.classFilter = classFilter;
            state.locoFilter = locoFilter;
        }
    }
});

export const { updateData } = homeFilterSlice.actions;

export default homeFilterSlice.reducer;