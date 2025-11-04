import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type AdvancedFilter = {
    rating: number
    price: [number, number]
    selectedTag: string[]
}

const initialState: AdvancedFilter = {
    rating: 0,
    price: [0, 1000],
    selectedTag: [],
}

const advancedFilterSlice = createSlice({
    name: "advancedFilter",
    initialState,
    reducers: {
        setAdvancedFilter: (
            state,
            action: PayloadAction<{ value: any; type: string }>
        ) => {
            switch (action.payload.type) {
                case "rating":
                    state.rating = Number(action.payload.value)
                    break

                case "price":
                    if (typeof action.payload.value === "object") {
                        state.price[0] = action.payload.value[0] ?? state.price[0]
                        state.price[1] = action.payload.value[1] ?? state.price[1]
                    }
                    break

                case "selectedTag":
                    const tag = String(action.payload.value)
                    if (state.selectedTag.includes(tag)) {
                        state.selectedTag = state.selectedTag.filter(
                            (t) => t !== tag
                        )
                    } else {
                        state.selectedTag.push(tag)
                    }
                    break

                default:
                    console.warn("Unknown filter type:", action.payload.type)
                    break
            }
        },

        resetAdvancedFilter: () => initialState,
    },
})

export const { setAdvancedFilter, resetAdvancedFilter } =
    advancedFilterSlice.actions

export default advancedFilterSlice.reducer
