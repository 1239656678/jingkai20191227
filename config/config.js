import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];
if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  proxy: {
    '/api/': {
      //匹配所有以/api/为开头的接口
      target: 'http://192.168.1.19:8080',
      //后端服务器地址
      changeOrigin: true,
      pathRewrite: {
        '/api/': '',
      }, //因为我们项目的接口前面并没有api 所以直接去掉
    },
  },
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/index',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
            },
            /******************************************************/
            {
              name: '查询表格',
              icon: 'smile',
              path: '/devicemanagement/:page',
              component: './deviceManagement',
            },
            {
              name: '区域管理',
              icon: 'smile',
              path: '/devicemanagement/area/areamanager',
              component: './devicemanagement/AreaManager',
            },
            {
              name: '区域添加表单',
              icon: 'smile',
              path: '/devicemanagement/form/addform',
              component: './devicemanagement/AddForm',
            },
            {
              name: '设备关联',
              icon: 'smile',
              path: '/devicemanagement/area/equipmentLink',
              component: './devicemanagement/equipmentLink',
            },
            {
              name: '区域添加设备表单',
              icon: 'smile',
              path: '/devicemanagement/OneAdd',
              component: './devicemanagement/OneAdd',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/classification',
              component: './classification',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/classification/addform',
              component: './classification/AddForm',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/classification/bind',
              component: './classification/BindMenu',
            },
            {
              name: '设备保养表单',
              icon: 'smile',
              path: '/equipmentledger/formbasicform',
              component: './equipmentLedger/FormBasicForm',
            },
            {
              name: '设备添加表单',
              icon: 'smile',
              path: '/equipmentledger/addform',
              component: './equipmentLedger/AddForm',
            },
            {
              name: '设备详情',
              icon: 'smile',
              path: '/equipmentledger/details',
              component: './equipmentLedger/Details',
            },
            {
              name: '基础表单',
              icon: 'smile',
              path: '/equipmentledger/editerfrom',
              component: './equipmentLedger/EditerFrom',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/equipmentledger',
              component: './equipmentLedger',
            },
            {
              name: '分步表单',
              icon: 'smile',
              path: '/dangermanage/repairlist/assignform',
              component: './DangerManage/ListTableList/assignform',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/dangermanage/repairlist',
              component: './DangerManage/ListTableList',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/dangermanage/reviewlist',
              component: './DangerManage/reviewList',
            },
            {
              name: '基础表单',
              icon: 'smile',
              path: '/dangermanage/addform',
              component: './DangerManage/AddForm',
            },

            {
              name: '基础表单',
              icon: 'smile',
              path: '/dangermanage/designate',
              component: './DangerManage/DesigNate',
            },
            {
              name: '高级详情页',
              icon: 'smile',
              path: '/dangermanage/detail',
              component: './DangerManage/DetailList',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/dangermanage',
              component: './DangerManage',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/securitytarget',
              component: './planManage/securityTarget',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/checkitem',
              component: './planManage/checkItem',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/checkitem/addFrom',
              component: './planManage/checkItem/AddForm',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/checkitem/bind',
              component: './planManage/checkItem/BindMenu',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/securityplan',
              component: './planManage/securityPlan',
            },
            {
              name: '专项检查添加页',
              icon: 'smile',
              path: '/securityplan/AddForm',
              component: './planManage/securityPlan/AddForm',
            },
            {
              name: '专项检查详情页',
              icon: 'smile',
              path: '/securityplan/detail',
              component: './planManage/securityPlan/Detail',
            },
            {
              name: '检查计划详情页',
              icon: 'smile',
              path: '/patrolPlan/detail',
              component: './planManage/patrolPlan/Detail',
            },
            {
              name: '检查计划添加页',
              icon: 'smile',
              path: '/patrolPlan/AddForm',
              component: './planManage/patrolPlan/AddForm',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/patrolplan',
              component: './planManage/patrolPlan',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/plantrace',
              component: './planManage/planTrace',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/rolemanage',
              component: './systemManage/roleManage',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/rolemanage/addform',
              component: './systemManage/roleManage/AddForm',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/rolemanage/bindmenu',
              component: './systemManage/roleManage/BindMenu',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/unitmanage',
              component: './systemManage/unitManage',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/depmanage',
              component: './systemManage/depManage',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/depmanage/addform',
              component: './systemManage/depManage/AddForm',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/depmanage/bindusers',
              component: './systemManage/depManage/BindUsers',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/depmanage/detail',
              component: './systemManage/depManage/detail',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/datalist',
              component: './systemManage/dataList',
            },
            {
              name: '添加',
              icon: 'smile',
              path: '/datalist/addForm',
              component: './systemManage/dataList/AddForm',
            },
            {
              name: '基础表单',
              icon: 'smile',
              path: '/listtableusers/addform',
              component: './systemManage/ListTableUsers/AddForm',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/listtableusers',
              component: './systemManage/ListTableUsers',
            },
            {
              name: '分析页',
              icon: 'smile',
              path: '/index',
              component: './index',
            },
            {
              name: '工作台',
              icon: 'smile',
              path: '/workplace',
              component: './Workplace',
            },
            {
              name: '标准列表',
              icon: 'smile',
              path: '/message',
              component: './Message',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/menumanage',
              component: './systemManage/MenuManage',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/menumanage/addform',
              component: './systemManage/MenuManage/AddForm',
            },
            {
              name: '查询表格',
              icon: 'smile',
              path: '/relevancelist',
              component: './deviceManagement/relevanceTable',
            },
            {
              name: '维修上报',
              path: '/maintenance/maintain',
              component: './maintenance/maintenance',
            },
            {
              name: '维修上报',
              path: '/maintenance/maintain/assignment',
              component: './maintenance/assignment',
            },
            {
              name: '维修记录',
              path: '/maintenance/maintenanceRecord',
              component: './maintenance/maintenanceRecord',
            },
            {
              name: '维修记录详情',
              path: '/maintenance/maintenanceRecord/repairDetail',
              component: './maintenance/repairDetail',
            },
            {
              name: '设备保养',
              path: '/smsMaintenanceTarget',
              component: './smsMaintenanceTarget',
            },

            {
              name: '保养标准',
              path: '/smsMaintenanceTarget/maintenanceStandard',
              component: './smsMaintenanceTarget/maintenanceStandard',
            },

            {
              name: '保养计划',
              path: '/smsMaintenanceTarget/maintenancePlan',
              component: './smsMaintenanceTarget/maintenancePlan',
            },
            {
              name: '保养记录',
              path: '/smsMaintenanceTarget/maintenanceRecord',
              component: './smsMaintenanceTarget/maintenanceRecord',
            },
            {
              name: '新增',
              path: '/smsMaintenanceTarget/maintenanceStandard/addForm',
              component: './smsMaintenanceTarget/addForm',
            },
            {
              name: '新增计划',
              path: '/smsMaintenanceTarget/maintenancePlan/addPlan',
              component: './smsMaintenanceTarget/addPlan',
            },
            {
              name: '保养详情',
              path: '/smsMaintenanceTarget/maintenanceRecord/maintenanceDetail',
              component: './smsMaintenanceTarget/maintenanceDetail',
            },
            //目标职责
            {
              name: '安全报表',
              path: '/targetResponsibility/securityreport',
              component: './TargetResponsibility/securityreport',
            },
            {
              name: '安全月报',
              path: '/targetResponsibility/monthreport',
              component: './TargetResponsibility/monthReport',
            },
            {
              name: '新增',
              path: '/targetResponsibility/securityreport/addreport',
              component: './TargetResponsibility/addReport',
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  }, // chainWebpack: webpackPlugin,
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
};
