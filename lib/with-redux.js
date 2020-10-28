import React from "react";
import createSore from "../store/store";

const isServer = typeof window === "undefined";
const __NEXT_REUDX_STORE__ = "__NEXT_REUDX_STORE__";

function getOrCreateStore(initialState) {
  if (isServer) {
    return createSore(initialState);
  }

  if (!window[__NEXT_REUDX_STORE__]) {
    window[__NEXT_REUDX_STORE__] = createSore(initialState);
  }
  return window[__NEXT_REUDX_STORE__];
}

export default (Comp) => {
  class WithReduxApp extends React.Component {
    constructor(props) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }

    render() {
      // const name = name + '123'

      const { Component, pageProps, ...rest } = this.props;

      // console.log(Component, pageProps)

      if (pageProps) {
        pageProps.test = "123";
      }

      return (
        <Comp
          Component={Component}
          pageProps={pageProps}
          {...rest}
          reduxStore={this.reduxStore}
        />
      );
    }
  }

  WithReduxApp.getInitialProps = async (ctx) => {
    let reduxStore = getOrCreateStore();
    if (isServer) {
      const { req } = ctx.ctx;

      const session = req.session;
      console.log("req.session", req.session);
      if (session) {
        // TODO why session is the whole github user API res, not session.userInfo?
        console.log("getOrCreateStore", session.userInfo);
        reduxStore = getOrCreateStore({
          user: session,
        });
      }
    }

    ctx.reduxStore = reduxStore;

    let appProps = {};
    if (typeof Comp.getInitialProps === "function") {
      appProps = await Comp.getInitialProps(ctx);
    }

    return {
      ...appProps,
      initialReduxState: reduxStore.getState(),
    };
  };

  return WithReduxApp;
};
