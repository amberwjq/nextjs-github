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
} from "antd";
import Link from "next/link";
import { useState, useCallback } from "react";
import getCofnig from "next/config";
import { connect } from "react-redux";

const { publicRuntimeConfig } = getCofnig();
const userDropdown = (
  <Menu>
    <Menu.Item>
      <a href="javascript.void(0)"> Sign Out</a>
    </Menu.Item>
  </Menu>
);
const githubIconStyle = {
  color: "white",
  fontSize: 40,
  display: "block",
  paddingTop: 10,
  marginRight: 20,
};
const { Header, Content, Footer } = Layout;
const MyLayout = ({ children, user }) => {
  const [search, setSearch] = useState();
  const handleSearchChange = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const handleOnSearch = useCallback(() => {}, []);
  return (
    <Layout>
      <Header>
        <div className="header-inner">
          <div className="header-left">
            <div className="logo">
              <Icon type="github" style={githubIconStyle} />
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
                  <a href={publicRuntimeConfig.OAUTH_URL}>
                    <Avatar size={40} icon="user" />
                  </a>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </Header>
      <Content>{children} </Content>
      <Footer style={{ textAlign: "center" }}>
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
          height: 100%;
        }
      `}</style>
    </Layout>
  );
};
export default connect(function mapState(state) {
  return {
    user: state.user,
  };
})(MyLayout);
