import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import accountReducer from "../features/account/accountSlice";
import settingsReducer from "../features/settings/settingsSlice";
import optionChainReducer from "../features/optionChain/optionChainSlice";
import openInterestReducer from "../features/openInterest/openInterestSlice";
import strategyBuilderReducer from "../features/strategyBuilder/strategyBuilderSlice";
import builtinStrategyReducer from "../features/builtinStrategies/builtinStrategySlice";
import watchlistReducer from "../features/watchlist/watchlistSlice";
import portfolioReducer from "../features/portfolio/portfolioSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    settings: settingsReducer,
    optionChain: optionChainReducer,
    openInterest: openInterestReducer,
    strategyBuilder: strategyBuilderReducer,
    builtinStrategy: builtinStrategyReducer,
    watchlist: watchlistReducer,
    portfolio: portfolioReducer,
  },
});
