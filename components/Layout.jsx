import {
  Button,
  Layout,
  Icon,
  Search,
  Avatar,
  Input,
  Tooltip,
  Dropdown,
  Menu,
} from 'antd';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { useState, useCallback } from 'react';
import getCofnig from 'next/config';
import { connect } from 'react-redux';
import { logout } from '../store/store';
import axios from 'axios';

const { publicRuntimeConfig } = getCofnig();

const githubIconStyle = {
  color: 'white',
  fontSize: 40,
  display: 'block',
  paddingTop: 10,
  marginRight: 20,
};
const { Header, Content, Footer } = Layout;
const MyLayout = ({ children, user, logout, router }) => {
  const urlQuery = router.query && router.query.query;
  const [search, setSearch] = useState(urlQuery || '');
  const handleOnSearch = useCallback(() => {
    router.push(`/search?query=${search}`);
  }, [search]);
  const handleSearchChange = useCallback((event) => {
    setSearch(event.target.value);
  }, []);
  const handleSignOut = useCallback(() => {
    console.log('call logout');
    logout();
  }, [logout]); //depend on props logout
  const userDropdown = (
    <Menu>
      <Menu.Item>
        <a href="javascript:void(0)" onClick={handleSignOut}>
          Sign Out
        </a>
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout>
      <Header>
        <div className="header-inner">
          <div className="header-left">
            <div className="logo">
              <Link href="/">
                <Icon type="github" style={githubIconStyle} />
              </Link>
            </div>
            <div>
              <Input.Search
                placeholder="Search Repo..."
                value={search}
                onChange={handleSearchChange}
                onSearch={handleOnSearch}
              />
            </div>
          </div>
          <div className="header-right">
            <div className="user">
              {user && user.id ? (
                <Dropdown overlay={userDropdown}>
                  <a href="/">
                    <Avatar size={40} src={user.avatar_url} />
                  </a>
                </Dropdown>
              ) : (
                <Tooltip title="Click To Sign In">
                  <a href={`/prepare-auth?url=${router.asPath}`}>
                    <Avatar size={40} icon="user" />
                  </a>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </Header>
      <Content>{children} </Content>
      <Footer style={{ textAlign: 'center' }}>
        Created by Amber @
        <a href="mailto:amberwjq@gmail.com">amberwjq@gmail.com</a>
      </Footer>
      <style jsx>
        {`
          .header-inner {
            display: flex;
            justify-content: space-between;
          }
          .header-left {
            display: flex;
          }
        `}
      </style>
      <style jsx global>{`
        #__next {
          height: 100%;
        }
        .ant-layout {
          min-height: 100%;
        }
        .ant-layout-content {
          background-color: white;
        }
      `}</style>
    </Layout>
  );
};
export default connect(
  function mapState(state) {
    return {
      user: state.user,
    };
  },
  function mapReducer(dispatch) {
    return {
      logout: () => dispatch(logout()),
    };
  }
)(withRouter(MyLayout));
