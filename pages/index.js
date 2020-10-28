import { useEffect } from "react";

import axios from "axios";

import Link from "next/link";
import Router from "next/router";
import { Button } from "antd";
import { connect } from "react-redux";
import getCofnig from "next/config";

const { publicRuntimeConfig } = getCofnig();

const Index = ({}) => {
  function gotoTestB() {
    Router.push(
      {
        pathname: "/test/b",
        query: {
          id: 2,
        },
      },
      "/test/b/2"
    );
  }

  useEffect(() => {
    axios.get("/api/user/info").then((resp) => console.log(resp));
  }, []);

  return (
    <>
      <a href={publicRuntimeConfig.OAUTH_URL}>去登录</a>
    </>
  );
};

Index.getInitialProps = async ({ reduxStore }) => {
  return {};
};

export default connect(function mapStateToProps(state) {
  return {
    user: state.user,
  };
})(Index);
