import { Product } from "@/app/type/Product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProductCard = {
    product: Product;
    variant: any; // bạn có thể thay `any` bằng kiểu variant cụ thể nếu đã định nghĩa
}

type ProductCardState = {
    productCards: ProductCard[];
};

const initialState: ProductCardState = {
    productCards: [],
};


const productCardSlice = createSlice(
    {
        name: "productCard",
        initialState,
        reducers: {
            addProductCards: (state, action: PayloadAction<{ product: Product, variant: any }>) => {
                state.productCards.push(action.payload)
            },
            removeProductCard: (state, action: PayloadAction<string>) => {
                state.productCards = state.productCards.filter(p => p.product._id !== action.payload);
            },
        }
    }
)
export const { addProductCards, removeProductCard } = productCardSlice.actions
export default productCardSlice.reducer

