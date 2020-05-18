import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props,
  });
  return (
    <>
      <div className={styles.container}>
          {/* <div className={styles.top}>
            <div className={styles.header}>
              <span className={styles.title}>安全管理平台</span>
            </div>
            <div className={styles.desc}>陕西缔科网络科技有限公司</div>
          </div> */}
          {children}
          <div className={styles.footertitle}>网站备案/许可证号：陕IPC备18007427号-2</div>
        </div>
        {/* <DefaultFooter /> */}
       
    </>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
