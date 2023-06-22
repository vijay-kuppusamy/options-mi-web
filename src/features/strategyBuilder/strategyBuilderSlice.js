import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNearestStrike } from "../../business/Utils";
import { getOptionByExpiryNStrike } from "../../business/OptionChain";
import strategyBuilderService from "./strategyBuilderService";

const initialState = {
  positions: [],
  strategies: [],
  strategy: {},
  strategyBuilderStatus: "idle", //'idle' | 'pending' | 'succeeded' | 'failed'
  strategyBuilderMessage: "",
};

function getExpirySteps(expiry, expiryDates) {
  let steps = 0;
  if (expiry && expiryDates) {
    steps = expiryDates.indexOf(expiry);
  }
  return steps;
}

function getStrikeSteps(strike, spotPrice, underlyingConfig) {
  let steps = 0;
  if (strike && spotPrice) {
    let stepValue = underlyingConfig.stepValue;
    spotPrice = getNearestStrike(spotPrice, stepValue);
    steps = (strike - spotPrice) / stepValue;
  }
  return steps;
}

function initStrategyPosition() {
  return {
    symbol: "",
    expirySteps: "",
    strikeSteps: "",
    option: "",
    transaction: "",
    lotSize: "",
  };
}

function constructStrategy(reqData) {
  let positions = reqData.positions;
  let expiryDates = reqData.expiryDates;
  let spotPrice = reqData.spotPrice;
  let underlyingConfig = reqData.underlyingConfig;
  let expiry = reqData.expiry;
  let strategy = reqData.strategy;
  let saveFormData = reqData.saveFormData;

  const request = {
    action: "",
    user: "",
    name: "",
    notes: "",
    positions: "",
  };

  let action = "";
  let name = "";
  let notes = "";
  if (strategy && strategy.name) {
    action = "update";
    name = strategy.name;
    notes = strategy.notes;
  } else {
    action = "create";
    name = saveFormData.name;
    notes = saveFormData.notes;
  }
  request.action = action;
  request.name = name;
  request.notes = notes;

  let strategyPositionList = [];
  if (positions && positions.length > 0) {
    for (let index = 0; index < positions.length; index++) {
      const element = positions[index];
      let expirySteps = getExpirySteps(expiry, expiryDates);
      let strikeSteps = getStrikeSteps(
        element.strikePrice,
        spotPrice,
        underlyingConfig
      );
      let strategyPosition = initStrategyPosition();
      strategyPosition.symbol = element.symbol;
      strategyPosition.expirySteps = expirySteps;
      strategyPosition.strikeSteps = strikeSteps;
      strategyPosition.option = element.option;
      strategyPosition.transaction = element.transaction;
      strategyPosition.lotSize = element.lotSize;
      strategyPositionList.push(strategyPosition);
    }
  }
  request.positions = strategyPositionList;

  return request;
}

export const saveStrategy = createAsyncThunk(
  "strategyBuilder/saveStrategy",
  async (reqData, thunkAPI) => {
    try {
      let request = constructStrategy(reqData);
      return await strategyBuilderService.saveStrategy(request);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteStrategy = createAsyncThunk(
  "strategyBuilder/deleteStrategy",
  async (reqData, thunkAPI) => {
    try {
      //console.log(reqData);
      if (reqData && reqData.name) {
        return await strategyBuilderService.deleteStrategy(reqData);
      } else {
        return { message: "Strategy is deleted" };
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getStrategies = createAsyncThunk(
  "strategyBuilder/getStrategies",
  async (reqData, thunkAPI) => {
    try {
      return await strategyBuilderService.getStrategies(reqData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const strategyBuilderSlice = createSlice({
  name: "strategyBuilder",
  initialState,
  reducers: {
    resetStrategyBuilder: (state) => {
      state.strategyBuilderStatus = "idle";
      state.strategyBuilderMessage = "";
    },
    setPosition: (state, action) => {
      state.positions = action.payload;
      state.strategy = {};
    },
    resetPosition: (state) => {
      state.positions = [];
      state.strategy = {};
    },
    addPosition: (state, action) => {
      addPositionState(state, action);
    },
    updatePosition: (state, action) => {
      updatePositionState(state, action);
    },
    deletePosition: (state, action) => {
      deletePositionState(state, action);
    },
    setStrategy: (state, action) => {
      state.strategy = action.payload.strategy;
    },
    loadStrategy: (state, action) => {
      loadStrategyState(state, action);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveStrategy.pending, (state) => {
        state.strategyBuilderStatus = "pending";
      })
      .addCase(saveStrategy.fulfilled, (state, action) => {
        state.strategyBuilderStatus = "succeeded";
        state.strategyBuilderMessage = action.payload.message;
      })
      .addCase(saveStrategy.rejected, (state, action) => {
        state.strategyBuilderStatus = "failed";
        state.strategyBuilderMessage = action.payload;
      })
      .addCase(getStrategies.pending, (state) => {
        state.strategyBuilderStatus = "pending";
      })
      .addCase(getStrategies.fulfilled, (state, action) => {
        state.strategyBuilderStatus = "succeeded";
        state.strategies = action.payload.data;
      })
      .addCase(getStrategies.rejected, (state, action) => {
        state.strategyBuilderStatus = "failed";
        state.strategyBuilderMessage = action.payload;
      })
      .addCase(deleteStrategy.pending, (state) => {
        state.strategyBuilderStatus = "pending";
      })
      .addCase(deleteStrategy.fulfilled, (state, action) => {
        state.strategyBuilderStatus = "succeeded";
        clearPositionState(state, action);
        state.strategyBuilderMessage = action.payload.message;
      })
      .addCase(deleteStrategy.rejected, (state, action) => {
        state.strategyBuilderStatus = "failed";
        state.strategyBuilderMessage = action.payload;
      });
  },
});

function addPositionState(state, action) {
  state.positions.forEach((element) => {
    if (
      element.symbol === action.payload.symbol &&
      element.expiry === action.payload.expiry &&
      element.strikePrice === action.payload.strikePrice &&
      element.option === action.payload.option &&
      element.transaction === action.payload.transaction
    ) {
      state.isError = true;
      state.message = "Similar position is added, please try update";
    }
  });
  if (!state.isError) {
    state.positions.push(action.payload);
  }
}

function updatePositionState(state, action) {
  try {
    state.positions[action.payload.index] = action.payload;
  } catch (error) {
    state.isError = true;
    state.message = error.message;
  }
}

function deletePositionState(state, action) {
  try {
    //console.log(action.payload.index);
    let tempOrder = [...state.positions];
    tempOrder.splice(action.payload.index, 1);
    state.positions = tempOrder;
  } catch (error) {
    console.log(error);
    state.isError = true;
    state.message = error.message;
  }
}

function clearPositionState(state, action) {
  try {
    state.positions = [];
    state.strategies = [];
    state.strategy = {};
  } catch (error) {
    state.isError = true;
    state.message = error.message;
  }
}

function loadPosition(
  index,
  strategyPosition,
  spotPrice,
  optionData,
  expiryDates,
  underlyingConfig
) {
  let expiry = expiryDates[strategyPosition.expirySteps];
  let stepValue = underlyingConfig.stepValue;
  let roundedSpotPrice = getNearestStrike(spotPrice, stepValue);
  let strikePrice = roundedSpotPrice + stepValue * strategyPosition.strikeSteps;
  let vol = "";
  let price = "";
  let iv = "";
  let data = getOptionByExpiryNStrike(optionData, expiry, strikePrice);
  if (data) {
    if (strategyPosition.option === "Call") {
      vol = data?.callTradedVolume;
      price = data?.callLastPrice;
      iv = data?.callIV;
    }
    if (strategyPosition.option === "Put") {
      vol = data?.putTradedVolume;
      price = data?.putLastPrice;
      iv = data?.putIV;
    }
  }

  let position = {
    index: index,
    symbol: strategyPosition.symbol,
    volume: vol,
    premium: price,
    expiryDate: expiry,
    strikePrice: strikePrice,
    spotPrice: spotPrice,
    option: strategyPosition.option,
    transaction: strategyPosition.transaction,
    iv: iv,
    lotSize: strategyPosition.lotSize,
    contractSize: underlyingConfig.lotSize,
  };
  return position;
}

function loadStrategyState(state, action) {
  try {
    state.strategy = action.payload.strategy;
    let strategyPositions = action.payload.strategy.positions;
    let optionData = action.payload.optionData;
    let expiryDates = action.payload.expiryDates;
    let underlyingConfig = action.payload.underlyingConfig;
    let spotPrice = action.payload.spotPrice;
    //console.log(strategyPositions);
    let positionList = [];
    if (strategyPositions && strategyPositions.length > 0) {
      for (let index = 0; index < strategyPositions.length; index++) {
        const element = strategyPositions[index];
        let position = loadPosition(
          index,
          element,
          spotPrice,
          optionData,
          expiryDates,
          underlyingConfig
        );
        positionList.push(position);
      }
    }
    state.positions = positionList;
    //console.log(positionList);
  } catch (error) {
    state.isError = true;
    state.message = error.message;
  }
}

export const {
  resetStrategyBuilder,
  setPosition,
  resetPosition,
  addPosition,
  updatePosition,
  deletePosition,
  setStrategy,
  loadStrategy,
} = strategyBuilderSlice.actions;

export default strategyBuilderSlice.reducer;
