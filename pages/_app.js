import App, { Container } from "next/app";
// import cs
import "antd/dist/antd.css";
import Layout from "../components/Layout";

//overwrite next 自带的app component
//保持一些公用的状态(global varaible)
//固定layout
//给页面pass一些自定义的data
//自定义error hanlder

class MyApp extends App {
  // must have getInitialProps!!!!
  static async getInitialProps({ Component }) {
    let pageProps;
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps();
    }

    return {
      pageProps,
    };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Container>
    );
  }
}

export default MyApp;
