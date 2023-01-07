import { configureStore } from '@reduxjs/toolkit';
import filterInputSlice from './filterInputSlice';

export default configureStore({
    reducer: {
        filter: filterInputSlice
    },
});