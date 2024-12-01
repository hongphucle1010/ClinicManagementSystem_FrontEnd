import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthorizationState {
  value: {
    cccd: string
  }
}

const authorization = createSlice({
  name: 'authorization',
  initialState: {
    value: {
      cccd: ''
    }
  },
  reducers: {
    logOutReducer: (state: AuthorizationState) => {
      state.value.cccd = ''
    },
    logInReducer: (state: AuthorizationState, action: PayloadAction<{ cccd: string }>) => {
      state.value = action.payload
    }
  }
})

const userReducer = authorization.reducer

export const { logOutReducer, logInReducer } = authorization.actions

export default userReducer
