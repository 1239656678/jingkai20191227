import React from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { getCookie } from '@/utils/authority';

// function testFun(arrs){
//   arrs && arrs.map(item=>{
//     item['key']=item.id
//     if(item.areaId!=null){
//         // console.log('aaaaaaaa============',item)
//         item.children.map(item=>{
//             // console.log('item===',item)
//             item['path'] = item.path+'/'+item.areaId
//         })
//     }
//     if(item.children!=[]){
//       testFun(item.children);
//     }
//   })
// }
class SecurityLayout extends React.Component {
  state = {
    isReady: false,
    menu: [],
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'login/findCurrentMenu',
    });
    // .then(()=>{
    //     console.log('login====',this.props.menuData)
    //     let arrs = this.props.menuData.payload
    //     testFun(arrs);
    //     // console.log("arr111====",arrs)
    // })

    this.props.dispatch({
      type: 'patroPlanModel/getPatroPlanList',
    });

    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  render() {
    const { isReady, menu } = this.state;
    const { children, loading, currentUser } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    let username = getCookie('userName');
    let token = getCookie(username);
    if (username == '' || username == null) {
      window.location.href = '/user/login';
    } else {
      const isLogin = '00000001';
      const queryString = stringify({
        redirect: window.location.href,
      });
      if ((!isLogin && loading) || !isReady) {
        return <PageLoading />;
      }

      if (!isLogin) {
        return <Redirect to={`/user/login?${queryString}`}></Redirect>;
      }
      return children;
    }
  }
}

export default connect(({ user, loading, login }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
  menuData: login.list,
}))(SecurityLayout);
