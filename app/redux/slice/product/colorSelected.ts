import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface colorState {
    selectedColors: string[]
}

const initialState: colorState = {
    selectedColors: [],
}

const colorSlice = createSlice({
    name: "color",
    initialState,
    reducers: {
        setcolor: (state, action: PayloadAction<string>) => {
            if (state.selectedColors.includes(action.payload)) {
                state.selectedColors = state.selectedColors.filter(
                    (id) => id !== action.payload
                )
            } else {
                state.selectedColors.push(action.payload)
            }
        },
        clearcolor: (state) => {
            state.selectedColors = []
        },
    },
})

export const { setcolor, clearcolor } = colorSlice.actions
export default colorSlice.reducer
