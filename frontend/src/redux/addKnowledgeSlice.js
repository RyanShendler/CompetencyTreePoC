import { createSlice } from "@reduxjs/toolkit"

const initState = {
    open: false,
    layerNum: 0
}

export const addKnowledgeSlice = createSlice({
    name: 'add-knowledge',
    initialState: initState,
    reducers: {
        toggleAddKnowledge: (state, action) => {
            return {
                ...state,
                ...action.payload
            }
        }
    }
})

export const {toggleAddKnowledge} = addKnowledgeSlice.actions;

export default addKnowledgeSlice.reducer