import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface SubCategoryState {
    selectedSubCategories: string[]
}

const initialState: SubCategoryState = {
    selectedSubCategories: [],
}

const subCategorySlice = createSlice({
    name: "subCategory",
    initialState,
    reducers: {
        setSubCategory: (state, action: PayloadAction<string>) => {
            if (state.selectedSubCategories.includes(action.payload)) {
                state.selectedSubCategories = state.selectedSubCategories.filter(
                    (id) => id !== action.payload
                )
            } else {
                state.selectedSubCategories.push(action.payload)
            }
        },
        clearSubCategory: (state) => {
            state.selectedSubCategories = []
        },
    },
})

export const { setSubCategory, clearSubCategory } = subCategorySlice.actions
export default subCategorySlice.reducer
