/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter, getMenuData } from '@ant-design/pro-layout';
// import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { Icon, Result, Button, Menu, Dropdown } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';
import loginMenu from '../pages/user/login/index';

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
/**
 * use Authorized check all menu item
 */

const menuDataRender = menuList =>
  // console.log('menuList===',menuList)
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    console.log('localItemaaaa==', localItem);
    return Authorized.check(item.authority, localItem, null);
  });
const defaultFooterDom = (
  <DefaultFooter
    copyright="2019 陕西缔科技术部出品"
    // links={[
    //   {
    //     key: 'Ant Design Pro',
    //     title: 'Ant Design Pro',
    //     href: 'https://pro.ant.design',
    //     blankTarget: true,
    //   },
    //   {
    //     key: 'github',
    //     title: <Icon type="github" />,
    //     href: 'https://github.com/ant-design/ant-design-pro',
    //     blankTarget: true,
    //   },
    //   {
    //     key: 'Ant Design',
    //     title: 'Ant Design',
    //     href: 'https://ant.design',
    //     blankTarget: true,
    //   },
    // ]}
  />
);

const footerRender = () => {
  // if (!isAntDesignPro()) {
  //   return defaultFooterDom;
  // }

  return (
    <>
      {/* {defaultFooterDom} */}
      <div
        style={{
          padding: '10px 24px 10px',
          textAlign: 'center',
        }}
      >
        陕西缔科网络科技有限公司
      </div>
    </>
  );
};

const BasicLayout = props => {
  const {
    dispatch,
    children,
    menuData,
    settings,
    location = {
      pathname: '/',
    },
  } = props;

  var arrs;
  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authorityconst

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  return (
    <ProLayout
      logo={logo}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/index">
          {logoDom}
          {titleDom}
        </Link>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }
        if (menuItemProps.areaId != null) {
          return (
            <Link
              to={{
                pathname: menuItemProps.path,
                state: { areaId: menuItemProps.areaId },
              }}
              onClick={() => {
                dispatch({
                  type: 'deviceManagement/queryListByregionsId',
                  payload: {
                    id: menuItemProps.areaId,
                    code: '',
                    name: '',
                    status: '',
                  },
                });
              }}
            >
              {defaultDom}
            </Link>
          );
        } else {
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
            defaultMessage: 'Home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      menuDataRender={() => {
        // console.log('menuData.payload====',menuData.payload)
        return menuData.payload;
      }}
      formatMessage={formatMessage}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings, login }) => ({
  collapsed: global.collapsed,
  settings,
  menuData: login.list,
}))(BasicLayout);
