import { Product } from "@/app/type/Product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type ProductCardState = {
    productCards: Product[];
};

const initialState: ProductCardState = {
    productCards: [],
};


const productCardSlice = createSlice(
    {
        name: "productCard",
        initialState,
        reducers: {
            addProductCards: (state, action: PayloadAction<Product>) => {
                state.productCards.push(action.payload)
            },
            removeProductCard: (state, action: PayloadAction<string>) => {
                state.productCards = state.productCards.filter(p => p._id !== action.payload);
            },
        }
    }
)
export const { addProductCards, removeProductCard } = productCardSlice.actions
export default productCardSlice.reducer

