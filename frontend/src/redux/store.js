import { configureStore } from '@reduxjs/toolkit';
import addKnowledgeSlice from './addKnowledgeSlice';
import userKnowledgeSlice from './userKnowledge';

const store = configureStore({
    reducer: {
        addKnowledge: addKnowledgeSlice,
        userKnowledge: userKnowledgeSlice
    }
})

export default store;