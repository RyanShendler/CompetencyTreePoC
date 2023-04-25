import { createSlice } from "@reduxjs/toolkit";

const initState = {
  skills: null,
  projectSkills: null,
  certs: null,
};

export const userKnowledgeSlice = createSlice({
    name: 'user-knowledge',
    initialState: initState,
    reducers: {
        toggleUserKnowledge: (state, action) => {
            return {
                ...state,
                ...action.payload
            }
        }
    }
})

export const {toggleUserKnowledge} = userKnowledgeSlice.actions;

export default userKnowledgeSlice.reducer
