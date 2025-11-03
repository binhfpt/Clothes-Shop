import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface brandState {
    selectedBrands: string[]
}

const initialState: brandState = {
    selectedBrands: [],
}

const brandSlice = createSlice({
    name: "brand",
    initialState,
    reducers: {
        setbrand: (state, action: PayloadAction<string>) => {
            if (state.selectedBrands.includes(action.payload)) {
                state.selectedBrands = state.selectedBrands.filter(
                    (id) => id !== action.payload
                )
            } else {
                state.selectedBrands.push(action.payload)
            }
        },
        clearbrand: (state) => {
            state.selectedBrands = []
        },
    },
})

export const { setbrand, clearbrand } = brandSlice.actions
export default brandSlice.reducer
