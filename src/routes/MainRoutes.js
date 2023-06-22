// project imports
import Layout from "../layout";
import Home from "../pages/home";
import Account from "../pages/account";
import OpenInterest from "../pages/openInterest";
import OptionChain from "../pages/optionChain";
import OptionGreeks from "../pages/optionGreeks";
import BuiltinStrategies from "../pages/builtinStrategies";
import StrategyBuilder from "../pages/strategyBuilder";
import Portfolio from "../pages/portfolio";
import Watchlist from "../pages/watchlist";
import HistoricalData from "../pages/historicalData";

const MainRoutes = {
  path: "/",
  element: <Layout />,
  children: [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/account",
      element: <Account />,
    },
    {
      path: "/option-chain",
      element: <OptionChain />,
    },
    {
      path: "/open-interest",
      element: <OpenInterest />,
    },
    {
      path: "/option-greeks",
      element: <OptionGreeks />,
    },
    {
      path: "/historical-data",
      element: <HistoricalData />,
    },
    {
      path: "/builtin-strategies",
      element: <BuiltinStrategies />,
    },
    {
      path: "/strategy-builder",
      element: <StrategyBuilder />,
    },
    {
      path: "/portfolio",
      element: <Portfolio />,
    },
    {
      path: "/watchlist",
      element: <Watchlist />,
    },
  ],
};

export default MainRoutes;
