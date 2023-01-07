import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    classFilter: '',
    locoFilter: ''
}

export const filterInputSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        updateData: (state, action) => {
            const { classFilter, locoFilter } = action.payload;
            state.classFilter = classFilter;
            state.locoFilter = locoFilter;
        }
    }
});

export const { updateData } = filterInputSlice.actions;

export default filterInputSlice.reducer;