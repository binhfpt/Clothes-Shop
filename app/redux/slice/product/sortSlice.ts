import { createSlice, PayloadAction } from "@reduxjs/toolkit"


const initialState: any = {
    selectedSortProducts: null,
}

const sortProductsSlice = createSlice({
    name: "sortproducts",
    initialState,
    reducers: {
        setSortProducts: (state, action: PayloadAction<string | null>) => {
            state.selectedSortProducts = action.payload
        },
        clearSortProducts: (state) => {
            state.selectedSortProducts = null
        },
    },
})

export const { setSortProducts, clearSortProducts } = sortProductsSlice.actions
export default sortProductsSlice.reducer
