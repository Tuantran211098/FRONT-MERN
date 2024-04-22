import { createSlice } from '@reduxjs/toolkit'



const initialState = {
  name: '',
  email: '',
  access_token: '',
  phone: '',
  address: '',
  avatar: '',
  // isLoading:false,
  isAdmin: false
}

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {

      const { _id = '', name = '', email = '', isAdmin, avatar = '', phone = '', address = '', access_token = '', city = '', refreshToken = '' } = action.payload
      console.log('updateUser', action.payload);

      state.name = name;
      state.email = email;
      state.phone = phone;
      state.id = _id;
      state.address = address;
      state.avatar = avatar;
      state.access_token = access_token;
      state.isAdmin = isAdmin;
      state.city = city;
      state.refreshToken = refreshToken
      // console.log('state',state);
    },
    resetUser: (state) => {

      state.name = '';
      state.id = '';
      state.email = '';
      state.access_token = '';
      state.phone = '';
      state.address = '';
      state.avatar = '';
      state.isAdmin = '';
      state.city = '';
      state.refreshToken = ''
      // console.log('state',state);
    }
  },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer