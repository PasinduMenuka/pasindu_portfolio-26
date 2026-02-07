import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

// Define a type for the slice state
export interface AppState {
    burgerMenuIsOpen: boolean
}

// Define the initial state using that type
const initialState: AppState = {
    burgerMenuIsOpen: false
}

export const appStateSlice = createSlice({
    name: 'appState',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        openMenu: state => {
            state.burgerMenuIsOpen = true
        },
        closeMenu: state => {
            state.burgerMenuIsOpen = false
        }
    }
})

export const { openMenu, closeMenu } = appStateSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.appState.burgerMenuIsOpen

export default appStateSlice.reducer