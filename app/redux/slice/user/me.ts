import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface meState {
    currenMe: any
}

const initialState: meState = {
    currenMe: null,
}

const meSlice = createSlice({
    name: "me",
    initialState,
    reducers: {
        setMe: (state, action: PayloadAction<any>) => {
            state.currenMe = action.payload
        },
        clearMe: (state) => {
            state.currenMe = null
        },
    },
})

export const { setMe, clearMe } = meSlice.actions
export default meSlice.reducer
