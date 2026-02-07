import { configureStore } from '@reduxjs/toolkit'
import AppStateReducer from "@/app/features/appState/appStateSlice";

export const store = configureStore({
    reducer: {
        appState:AppStateReducer
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch