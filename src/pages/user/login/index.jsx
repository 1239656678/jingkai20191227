import { Alert, Checkbox, Icon, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import GlobalModel from '../../../models/global';
import { getCookie, delCookie, setCookie } from '@/utils/authority';
import LoginComponents from './components/Login';
import styles from './style.less';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

class Login extends Component {
  loginForm = undefined;
  state = {
    type: 'account',
    autoLogin: true,
    menuList: [],
  };
  componentDidMount() {
     let username = getCookie('userName');
     if(username!==null|| username!==''){
      delCookie('userName');
      delCookie(username);
     }
  }
  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };
  handleSubmit = (err, values) => {
    // const { type } = this.state;
    // console.log(this.props)
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: { ...values },
      })
     
      // this.props.dispatch({
      //   type: 'login/findCurrentMenu',
      // });
      //   .then(()=>{
      //     console.log("login")
      //     console.log(this.props.userLogin)
      // })
    }
  };
  onTabChange = type => {
    this.setState({
      type,
    });
  };
  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, async (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;

          try {
            const success = await dispatch({
              type: 'login/getCaptcha',
              payload: values.mobile,
            });
            resolve(!!success);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { userLogin = {}, submitting } = this.props;
    const { status, type: loginType } = userLogin;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.background}>
      <div className={styles.main}>
      <div className={styles.headtitle}>
        <p className={styles.fontsizestyle}>消防安全监管平台</p><p className={styles.fontsizestyle2}>Fire safety supervision platform</p></div>
      <div  className={styles.logindemo}>
      <LoginComponents
         defaultActiveKey={type}
         onTabChange={this.onTabChange}
         onSubmit={this.handleSubmit}
         onCreate={form => {
           this.loginForm = form;
         }}
       >
         <div><p  className={styles.formtitle}>欢迎登录</p><p className={styles.xian}></p></div>
         <div className={styles.formcontent}>
         <UserName
         
         name="username"
         placeholder={`${formatMessage({
           id: 'user-login.login.userName',
         })}`}
         rules={[
           {
             required: true,
             message: formatMessage({
               id: 'user-login.userName.required',
             }),
           },
         ]}
       />
       <Password
         name="password"
         placeholder={`${formatMessage({
           id: 'user-login.login.password',
         })}: password`}
         rules={[
           {
             required: true,
             message: formatMessage({
               id: 'user-login.password.required',
             }),
           },
         ]}
         onPressEnter={e => {
           e.preventDefault();

           if (this.loginForm) {
             this.loginForm.validateFields(this.handleSubmit);
           }
         }}
       />

       <div>
         <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
           <FormattedMessage id="user-login.login.remember-me" />
         </Checkbox>
         <a
           style={{
             float: 'right',
           }}
           href=""
         >
           <FormattedMessage id="user-login.login.forgot-password" />
         </a>
       </div>
       <Submit loading={submitting}>
         <FormattedMessage id="user-login.login.login" />
       </Submit>
         </div>
         
       </LoginComponents>
      </div>
        
      </div>
      </div>
    );
  }
}

export default connect(({ login, loading,user }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
  userData : login.userData,
  changeLoginStatus : login.code,
  currentUser : user.currentUser
}))(Login);
