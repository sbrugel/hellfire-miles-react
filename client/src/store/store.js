import { configureStore } from '@reduxjs/toolkit';
import homeFilterSlice from './homeFilterSlice';

export default configureStore({
    reducer: {
        homeFilter: homeFilterSlice
    },
});