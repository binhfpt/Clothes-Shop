import { configureStore } from '@reduxjs/toolkit'
import { productApi } from '../api/productAPI'
import { categoryAPI, subcategoryAPI } from '../api/categoryAPI'
import categorySlice from "../slice/category/categorySelected"
import { brandAPI } from '../api/brandAPI'
import { imageAPI } from '../api/imageAPI'
import colorSlice from "../slice/product/colorSelected"
import brandSlice from "../slice/brand/brandSelected"
import subCategorySlice from "../slice/subcategory/subcategoriesSelected"
import advancedFilterSlice from "../slice/product/advancedFilter"
import sortProductsSlice from "../slice/product/sortSlice"
import { blogAPI } from '../api/blogAPI'
import { meAPI } from '../api/meAPI'
export const store = configureStore({
    reducer: {
        [productApi.reducerPath]: productApi.reducer,
        [categoryAPI.reducerPath]: categoryAPI.reducer,
        [subcategoryAPI.reducerPath]: subcategoryAPI.reducer,
        [brandAPI.reducerPath]: brandAPI.reducer,
        [imageAPI.reducerPath]: imageAPI.reducer,
        [blogAPI.reducerPath]: blogAPI.reducer,
        [meAPI.reducerPath]: meAPI.reducer,

        advancedFilter: advancedFilterSlice,
        category: categorySlice,
        color: colorSlice,
        sortproducts: sortProductsSlice,
        subCategory: subCategorySlice,
        brand: brandSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(productApi.middleware).concat(categoryAPI.middleware).concat(subcategoryAPI.middleware)
            .concat(brandAPI.middleware).concat(imageAPI.middleware).concat(blogAPI.middleware).concat(meAPI.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
