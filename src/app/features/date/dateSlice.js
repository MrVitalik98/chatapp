import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  "year": null,
  "month": null,
  "day": null,
  "hour": null,
  "minute": null,
  "seconds": null,
  "milliSeconds": null,
  "dateTime": "",
  "date": "",
  "time": "",
  "timeZone": "",
  "dayOfWeek": "",
  "dstActive": false
}

const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setDate(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  }
})


// Export Actions
export const { setDate } = dateSlice.actions

// Export Reducer
export default dateSlice.reducer