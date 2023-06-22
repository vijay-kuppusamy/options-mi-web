import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  positions: [],
  strategy: '',
  message: ''
};

export const builtinStrategySlice = createSlice({
  name: 'builtinStrategy',
  initialState,
  reducers: {
    reset: (state) => {
      state.positions = [];
      state.message = '';
      state.strategy = '';
    },
    setStrategy: (state, action) => {
      state.strategy = action.payload;
    },
    addPosition: (state, action) => {
      addPositionState(state, action);
    },
    updatePosition: (state, action) => {
      updatePositionState(state, action);
    }
  }
});

function addPositionState(state, action) {
  let positions = action.payload;
  state.positions = positions;
}

function updatePositionState(state, action) {
  state.positions[action.payload.index] = action.payload;
}

export const { reset, setStrategy, addPosition, updatePosition } = builtinStrategySlice.actions;

export default builtinStrategySlice.reducer;
