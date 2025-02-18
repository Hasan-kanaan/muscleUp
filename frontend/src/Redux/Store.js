import { configureStore } from 'node_modules/@reduxjs/toolkit'
import CounterSlice from './CounterSlice'

export const store = configureStore({
  reducer: CounterSlice,
})