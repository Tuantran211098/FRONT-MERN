import { createSlice } from '@reduxjs/toolkit'



const initialState = {
  search:''
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {

    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1
    // },
    // decrement: (state) => {
    //   state.value -= 1
    // },
    searchProduct: (state, action) => {
      state.search = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { searchProduct } = productSlice.actions

export default productSlice.reducer