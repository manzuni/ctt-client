import React, { useEffect, useState } from "react";
import requireAuth from "../../components/requireAuth";
import axios from "axios";
import { connect } from "react-redux";

const ExchangeInfo = (props) => {
  const [tradableUSDTCoins, setTradableUSDTCoins] = useState([]);

  const postRequest = async () => {
    let config = {
      headers: {
        authorization: props.authenticated, // this is the token in Redux
      },
    };

    const url = process.env.REACT_APP_API_BACKEND_URL + "/exchangeInfo";
    const response = await axios.post(url, null, config);

    return response.data;
  };

  useEffect(
    () => {
      console.log("Fetching market data.");
      postRequest().then((res) => {
        let USDTCoins = [];

        res.symbols?.map((symbol) => {
          if (symbol.quoteAsset === "USDT" && symbol.status === "TRADING") {
            USDTCoins = [...USDTCoins, symbol];
          }
          if (symbol.quoteAsset === "USDT" && symbol.status !== "TRADING") {
            console.log(symbol);
          }

          return true;
        });

        setTradableUSDTCoins({
          serverTime: new Date(res.serverTime).toString(),
          data: USDTCoins,
        });
      });
    },
    // eslint-disable-next-line
    []
  );

  const renderUSDTCoinsList = tradableUSDTCoins.data?.map((coin) => {
    return (
      <div className="inline" key={coin.symbol}>
        <li style={{ listStyleType: "none" }}>{coin.symbol}</li>
      </div>
    );
  });
  const ustTickersString = tradableUSDTCoins.data?.map((data) => {
    return `${data.symbol.toLowerCase()}@ticker/`;
  });

  return (
    <>
      <div>ExchangeInfo Page</div>
      {tradableUSDTCoins !== [] ? (
        <div>
          {tradableUSDTCoins.serverTime} <br />
          {renderUSDTCoinsList?.length}
          <br />
          {renderUSDTCoinsList}
          {ustTickersString}
        </div>
      ) : (
          "Loading..."
        )}
    </>
  );
};

const mapStateToProps = (state) => {
  return { authenticated: state.auth.authenticated };
};

export default connect(mapStateToProps)(requireAuth(ExchangeInfo));
