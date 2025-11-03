import { configureStore } from '@reduxjs/toolkit'
import { productApi } from '../api/productAPI'
import { categoryAPI, subcategoryAPI } from '../api/categoryAPI'
import categorySlice from "../slice/category/categorySelected"
import { brandAPI } from '../api/brandAPI'
import colorSlice from "../slice/product/colorSelected"
import brandSlice from "../slice/brand/brandSelected"
import subCategorySlice from "../slice/subcategory/subcategoriesSelected"

export const store = configureStore({
    reducer: {
        [productApi.reducerPath]: productApi.reducer,
        [categoryAPI.reducerPath]: categoryAPI.reducer,
        [subcategoryAPI.reducerPath]: subcategoryAPI.reducer,
        [brandAPI.reducerPath]: brandAPI.reducer,

        category: categorySlice,
        color: colorSlice,
        subCategory: subCategorySlice,
        brand: brandSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(productApi.middleware).concat(categoryAPI.middleware).concat(subcategoryAPI.middleware)
            .concat(brandAPI.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
