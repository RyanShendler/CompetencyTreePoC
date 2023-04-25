import { createSlice } from "@reduxjs/toolkit";

const initState = {
  layers: []
};

export const layerSlice = createSlice({
    name: 'layer',
    initialState: initState,
    reducers: {
        toggleLayers: (state, action) => {
            return {
                ...state,
                ...action.payload
            }
        }
    }
})

export const {toggleLayers} = layerSlice.actions;

export default layerSlice.reducer