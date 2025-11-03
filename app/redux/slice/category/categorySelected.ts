import { createSlice, PayloadAction } from "@reduxjs/toolkit"


const initialState: any = {
    selectedCategory: null,
}

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategory: (state, action: PayloadAction<string | null>) => {
            state.selectedCategory = action.payload
        },
        clearCategory: (state) => {
            state.selectedCategory = null
        },
    },
})

export const { setCategory, clearCategory } = categorySlice.actions
export default categorySlice.reducer
