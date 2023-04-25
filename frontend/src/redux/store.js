import { configureStore } from '@reduxjs/toolkit';
import addKnowledgeSlice from './addKnowledgeSlice';
import userKnowledgeSlice from './userKnowledge';
import layerSlice from './layerSlice';

const store = configureStore({
    reducer: {
        addKnowledge: addKnowledgeSlice,
        userKnowledge: userKnowledgeSlice,
        layer: layerSlice
    }
})

export default store;