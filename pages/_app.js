import App, { Container } from 'next/app';
import { Provider } from 'react-redux';
import axios from 'axios';
import 'antd/dist/antd.css';
import Router from 'next/router';
import MyContext from '../lib/my-context';
import Layout from '../components/Layout';

import testHoc from '../lib/with-redux';
import PageLoading from '../components/PageLoading';

class MyApp extends App {
  state = {
    context: 'value',
    loading: false,
  };
  startLoading = () => {
    this.setState({
      loading: true,
    });
  };

  stopLoading = () => {
    this.setState({
      loading: false,
    });
  };
  componentDidMount() {
    Router.events.on('routeChangeStart', this.startLoading);
    Router.events.on('routeChangeComplete', this.stopLoading);
    Router.events.on('routeChangeError', this.stopLoading);

    axios
      .get('https://api.github.com/search/repositories?q=react')
      .then((res) => {
        console.log('git repos', res);
      });
  }

  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.startLoading);
    Router.events.off('routeChangeComplete', this.stopLoading);
    Router.events.off('routeChangeError', this.stopLoading);
  }

  static async getInitialProps(ctx) {
    const { Component } = ctx;
    console.log('app init');
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return {
      pageProps,
    };
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Container>
        <Provider store={reduxStore}>
          {this.state.loaindg ? <PageLoading /> : null}
          <Layout>
            <MyContext.Provider value={this.state.context}>
              <Component {...pageProps} />
            </MyContext.Provider>
          </Layout>
        </Provider>
      </Container>
    );
  }
}

export default testHoc(MyApp);
