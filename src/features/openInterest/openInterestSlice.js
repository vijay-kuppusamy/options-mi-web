import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  strikePrices: [],
  callsOI: [],
  callsOIChange: [],
  putsOI: [],
  putsOIChange: [],
};

export const openInterestSlice = createSlice({
  name: "openInterest",
  initialState,
  reducers: {
    setOpenInterest: (state, action) => {
      const openInterest = getOpenInterestData(action.payload);
      state.strikePrices = openInterest.strikePrices;
      state.callsOI = openInterest.callsOI;
      state.putsOI = openInterest.putsOI;
      state.callsOIChange = openInterest.callsOIChange;
      state.putsOIChange = openInterest.putsOIChange;
    },
  },
});

function getOpenInterestData(payload) {
  //console.log('getOpenInterestData');

  const data = payload.data;
  const price = payload.price;
  const size = payload.size;
  //
  if (data && price && price > 0) {
    let strikePrices = [];
    let callsOI = [];
    let putsOI = [];
    let callsOIChange = [];
    let putsOIChange = [];

    try {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var callOI = element?.callOI;
        var putOI = element?.putOI;
        var callOIChange = element?.callOIChg;
        var putOIChange = element?.putOIChg;

        strikePrices.push(element?.strikePrice);
        callsOI.push(callOI * size);
        putsOI.push(putOI * size);
        callsOIChange.push(callOIChange);
        putsOIChange.push(putOIChange);
      }
    } catch (error) {
      console.log(error);
    }
    const openInterest = {
      strikePrices: strikePrices,
      callsOI: callsOI,
      putsOI: putsOI,
      callsOIChange: callsOIChange,
      putsOIChange: putsOIChange,
    };
    //
    return openInterest;
  }
  return {};
}

export const { setOpenInterest } = openInterestSlice.actions;

export default openInterestSlice.reducer;
