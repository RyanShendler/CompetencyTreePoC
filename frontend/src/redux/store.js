import { configureStore } from '@reduxjs/toolkit';
import addKnowledgeSlice from './addKnowledgeSlice';

const store = configureStore({
    reducer: {
        addKnowledge: addKnowledgeSlice,
    }
})

export default store;