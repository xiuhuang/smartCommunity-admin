import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@tmp/history';
import RendererWrapper0 from '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__BlankLayout" */ '../../layouts/BlankLayout'),
          LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/BlankLayout').default,
    routes: [
      {
        path: '/user',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "layouts__UserLayout" */ '../../layouts/UserLayout'),
              LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                .default,
            })
          : require('../../layouts/UserLayout').default,
        routes: [
          {
            path: '/user',
            redirect: '/user/login',
            exact: true,
          },
          {
            name: '登录',
            path: '/user/login',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__user__login" */ '../user/login'),
                  LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                    .default,
                })
              : require('../user/login').default,
            exact: true,
          },
          {
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__404" */ '../404'),
                  LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                    .default,
                })
              : require('../404').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "layouts__BasicLayout" */ '../../layouts/BasicLayout'),
              LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                .default,
            })
          : require('../../layouts/BasicLayout').default,
        Routes: [require('../Authorized').default],
        routes: [
          {
            path: '/integratedKanban',
            name: '社区综合看板',
            icon: 'iconicon-test8',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__integratedKanban__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/integratedKanban/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__integratedKanban" */ '../integratedKanban'),
                  LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                    .default,
                })
              : require('../integratedKanban').default,
            exact: true,
          },
          {
            path: '/da',
            icon: 'iconicon-test4',
            name: '社区档案',
            routes: [
              {
                path: '/da/search',
                name: '检索',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__search__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/search/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/search'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/search').default,
                exact: true,
              },
              {
                path: '/da/search/:searchText',
                name: '检索详情',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__search__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/search/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/search/result'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/search/result').default,
                exact: true,
              },
              {
                path: '/da/residentFile',
                name: '社区居民档案',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__residentFile__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/residentFile/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/residentFile'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/residentFile').default,
                exact: true,
              },
              {
                path: '/da/residentFile/detail',
                name: '社区居民详情',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__residentFile__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/residentFile/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/residentFile/residentDetail'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/residentFile/residentDetail').default,
                exact: true,
              },
              {
                path: '/da/residentFile/carDetail',
                name: '社区车辆详情',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__residentFile__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/residentFile/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/residentFile/carDetail'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/residentFile/carDetail').default,
                exact: true,
              },
              {
                path: '/da/residentFile/addResident',
                name: '添加居民',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__residentFile__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/residentFile/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/residentFile/residentEdit'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/residentFile/residentEdit').default,
                exact: true,
              },
              {
                path: '/da/residentFile/editResident',
                name: '编辑居民信息',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__residentFile__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/residentFile/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/residentFile/residentEdit'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/residentFile/residentEdit').default,
                exact: true,
              },
              {
                path: '/da/basicConstruction',
                name: '社区基础建设档案',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__basicConstruction__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/basicConstruction/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/basicConstruction'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/basicConstruction').default,
                exact: true,
              },
              {
                path: '/da/basicFacility',
                name: '社区基础设施档案',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__basicFacility__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/basicFacility/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/basicFacility'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/basicFacility').default,
                exact: true,
              },
              {
                path: '/da/Institution',
                name: '社区实有单位档案',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__institution__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/institution/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/institution'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/institution').default,
                exact: true,
              },
              {
                path: '/da/Institution/detail/:companyId/:urlContActiveKey',
                name: '单位信息详情',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__institution__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/institution/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/institution/detail'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/institution/detail').default,
                exact: true,
              },
              {
                path: '/da/Institution/add',
                name: '添加单位',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__institution__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/institution/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/institution/addInstitution'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/institution/addInstitution').default,
                exact: true,
              },
              {
                path: '/da/Institution/edit/:companyId',
                name: ' 编辑单位',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__institution__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/institution/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/institution/editInstitution'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/institution/editInstitution').default,
                exact: true,
              },
              {
                path: '/da/Institution/addCarInfo',
                name: '添加车辆信息',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__institution__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/institution/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/institution/editCarInfo'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/institution/editCarInfo').default,
                exact: true,
              },
              {
                path: '/da/Institution/editCarInfo',
                name: '编辑车辆信息',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__institution__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/institution/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/institution/editCarInfo'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/institution/editCarInfo').default,
                exact: true,
              },
              {
                path: '/da/Institution/carDetail',
                name: '社区车辆详情',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__da__institution__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/da/institution/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../da/institution/carDetail'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../da/institution/carDetail').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            name: '数据分析',
            path: '/dataAnalysis',
            icon: 'iconicon-test6',
            routes: [
              {
                name: '人车进出',
                path: '/dataAnalysis/turnover',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../Welcome'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Welcome').default,
                exact: true,
              },
              {
                name: '实有房屋',
                path: '/dataAnalysis/house',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../Welcome'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Welcome').default,
                exact: true,
              },
              {
                name: '实有人口',
                path: '/dataAnalysis/population',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../Welcome'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Welcome').default,
                exact: true,
              },
              {
                name: '社区力量',
                path: '/dataAnalysis/power',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../Welcome'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Welcome').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            name: '安防监控',
            path: '/security',
            icon: 'iconicon-test10',
            routes: [
              {
                name: '设备监控',
                path: '/security/device',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../Welcome'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Welcome').default,
                exact: true,
              },
              {
                name: '视频监控',
                path: '/security/video',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../Welcome'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Welcome').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            name: '访客管理',
            path: '/visitor',
            icon: 'iconicon-test5',
            routes: [
              {
                name: '访客预约',
                path: '/visitor/reservation',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__visitor__reservation__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/visitor/reservation/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../visitor/reservation'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../visitor/reservation').default,
                exact: true,
              },
              {
                name: '访客登记',
                path: '/visitor/registration',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__visitor__registration__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/visitor/registration/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../visitor/registration'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../visitor/registration').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/payment',
            icon: 'iconicon-test7',
            name: '生活缴费',
            routes: [
              {
                path: '/payment/management',
                name: '物业费缴纳情况',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__payment__management__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/payment/management/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../payment/management'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../payment/management').default,
                exact: true,
              },
              {
                path: '/payment/deposit',
                name: '押金缴纳记录',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__payment__deposit__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/payment/deposit/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../payment/deposit'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../payment/deposit').default,
                exact: true,
              },
              {
                path: '/payment/alimony',
                name: '生活缴费记录',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__payment__alimony__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/payment/alimony/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../payment/alimony'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../payment/alimony').default,
                exact: true,
              },
              {
                path: '/payment/parking',
                name: '停车费缴纳记录',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__payment__parking__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/payment/parking/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../payment/parking'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../payment/parking').default,
                exact: true,
              },
              {
                path: '/payment/management/detail/:parmas',
                name: '物业费缴纳记录详情',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__payment__management__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/payment/management/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../payment/management/detail'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../payment/management/detail').default,
                exact: true,
              },
              {
                path: '/payment/lifeManage',
                name: '生活缴费账号管理',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__payment__lifeManage__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/payment/lifeManage/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../payment/lifeManage'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../payment/lifeManage').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/communityService',
            icon: 'iconicon-test',
            name: '社区服务管理',
            routes: [
              {
                path: '/communityService/service',
                name: '社区服务',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__communityService__service__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/communityService/service/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../communityService/service'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../communityService/service').default,
                exact: true,
              },
              {
                path: '/communityService/serviceType',
                name: '服务类型',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__communityService__serviceType__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/communityService/serviceType/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../communityService/serviceType'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../communityService/serviceType').default,
                exact: true,
              },
              {
                path: '/communityService/service/addService',
                name: '新增服务',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__communityService__service__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/communityService/service/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../communityService/service/addService'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../communityService/service/addService').default,
                exact: true,
              },
              {
                path: '/communityService/service/addService/:id',
                name: '编辑服务',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__communityService__service__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/communityService/service/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../communityService/service/addService'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../communityService/service/addService').default,
                exact: true,
              },
              {
                path: '/communityService/service/detail/:id',
                name: '服务详情',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__communityService__service__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/communityService/service/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../communityService/service/detail'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../communityService/service/detail').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/earlyWarning',
            icon: 'iconicon-test18',
            name: '预警记录',
            routes: [
              {
                path: '/earlyWarning/parabolic',
                name: '高空抛物预警',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__earlyWarning__parabolic__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/earlyWarning/parabolic/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../earlyWarning/parabolic'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../earlyWarning/parabolic').default,
                exact: true,
              },
              {
                path: '/earlyWarning/focus',
                name: '重点关注预警',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__earlyWarning__focus__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/earlyWarning/focus/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../earlyWarning/focus'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../earlyWarning/focus').default,
                exact: true,
              },
              {
                path: '/earlyWarning/fence',
                name: '电子围栏报警',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__earlyWarning__fence__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/earlyWarning/fence/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../earlyWarning/fence'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../earlyWarning/fence').default,
                exact: true,
              },
              {
                path: '/earlyWarning/alarm',
                name: '居民报警',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__earlyWarning__alarm__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/earlyWarning/alarm/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../earlyWarning/alarm'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../earlyWarning/alarm').default,
                exact: true,
              },
              {
                path: '/earlyWarning/smoke',
                name: '烟感报警',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__earlyWarning__smoke__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/earlyWarning/smoke/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../earlyWarning/smoke'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../earlyWarning/smoke').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/patrol',
            icon: 'iconxingzhuang',
            name: '社区巡更',
            routes: [
              {
                path: '/patrol/monitor',
                name: '社区巡更监控',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../Welcome'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Welcome').default,
                exact: true,
              },
              {
                path: '/patrol/way',
                name: '巡更路线管理',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../Welcome'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Welcome').default,
                exact: true,
              },
              {
                path: '/patrol/task',
                name: '巡更任务',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../Welcome'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Welcome').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/trajectory',
            icon: 'iconicon-test9',
            name: '轨迹分析',
            routes: [
              {
                path: '/trajectory/personnel',
                name: '人员轨迹',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../Welcome'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Welcome').default,
                exact: true,
              },
              {
                path: '/trajectory/car',
                name: '车辆轨迹',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../Welcome'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Welcome').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/infoBulletin',
            icon: 'iconicon-test3',
            name: '资讯公告',
            routes: [
              {
                path: '/infoBulletin/infoManage',
                name: '资讯管理',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__infoBulletin__infoManage__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/infoBulletin/infoManage/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../infoBulletin/infoManage'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../infoBulletin/infoManage').default,
                exact: true,
              },
              {
                path: '/infoBulletin/clumn',
                name: '栏目分类',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__infoBulletin__clumn__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/infoBulletin/clumn/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../infoBulletin/clumn'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../infoBulletin/clumn').default,
                exact: true,
              },
              {
                path: '/infoBulletin/infoManage/addInfo',
                name: '新增资讯',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__infoBulletin__infoManage__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/infoBulletin/infoManage/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../infoBulletin/infoManage/addInfo'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../infoBulletin/infoManage/addInfo').default,
                exact: true,
              },
              {
                path: '/infoBulletin/infoManage/addInfo/:id',
                name: '编辑资讯',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__infoBulletin__infoManage__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/infoBulletin/infoManage/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../infoBulletin/infoManage/addInfo'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../infoBulletin/infoManage/addInfo').default,
                exact: true,
              },
              {
                path: '/infoBulletin/infoManage/detail/:id',
                name: '资讯详情',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__infoBulletin__infoManage__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/infoBulletin/infoManage/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../infoBulletin/infoManage/detail'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../infoBulletin/infoManage/detail').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/activity',
            icon: 'iconicon-test',
            name: '社区活动',
            routes: [
              {
                path: '/activity/vote',
                name: '投票活动',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__activity__vote__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/activity/vote/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../activity/vote'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../activity/vote').default,
                exact: true,
              },
              {
                path: '/activity/auditing',
                name: '居民活动审核',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__activity__auditing__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/activity/auditing/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../activity/auditing'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../activity/auditing').default,
                exact: true,
              },
              {
                path: '/activity/vote/addActivity',
                name: '新增活动',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__activity__vote__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/activity/vote/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../activity/vote/addActivity'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../activity/vote/addActivity').default,
                exact: true,
              },
              {
                path: '/activity/vote/editActivity/:voteId',
                name: '编辑活动',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__activity__vote__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/activity/vote/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../activity/vote/editActivity'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../activity/vote/editActivity').default,
                exact: true,
              },
              {
                path: '/activity/vote/detail/:parmas',
                name: '活动详情',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__activity__vote__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/activity/vote/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../activity/vote/detail'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../activity/vote/detail').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/residentAffairs',
            icon: 'iconicon-test2',
            name: '居民事务',
            routes: [
              {
                path: '/residentAffairs/report',
                name: '居民报事',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__residentAffairs__report__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/residentAffairs/report/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../residentAffairs/report'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../residentAffairs/report').default,
                exact: true,
              },
              {
                path: '/residentAffairs/complaint',
                name: '居民投诉',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__residentAffairs__complaint__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/residentAffairs/complaint/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../residentAffairs/complaint'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../residentAffairs/complaint').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/audit',
            icon: 'iconicon-test11',
            name: '认证审核',
            routes: [
              {
                path: '/audit/resident',
                name: '居民认证',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__audit__resident__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/audit/resident/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../audit/resident'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../audit/resident').default,
                exact: true,
              },
              {
                path: '/audit/buildings',
                name: '房屋认证',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__audit__buildings__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/audit/buildings/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../audit/buildings'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../audit/buildings').default,
                exact: true,
              },
              {
                path: '/audit/vehicle',
                name: '车辆认证',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__audit__vehicle__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/audit/vehicle/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../audit/vehicle'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../audit/vehicle').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/system',
            icon: 'iconxitongguanli_',
            name: '系统管理',
            routes: [
              {
                path: '/system/department',
                name: '部门管理',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__system__department__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/system/department/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../system/department'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../system/department').default,
                exact: true,
              },
              {
                path: '/system/manager',
                name: '社区组织管理人员',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__system__organization__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/system/organization/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../system/organization'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../system/organization').default,
                exact: true,
              },
              {
                path: '/system/user',
                name: '用户管理',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__system__user__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/system/user/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../system/user'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../system/user').default,
                exact: true,
              },
              {
                path: '/system/role',
                name: '角色管理',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__system__role__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/system/role/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../system/role'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../system/role').default,
                exact: true,
              },
              {
                path: '/system/log',
                name: '系统日志',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__system__log__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/system/log/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../system/log'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../system/log').default,
                exact: true,
              },
              {
                path: '/system/letter',
                name: '站内信',
                icon: 'icontuoyuanxing1',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__system__letter__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/system/letter/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../system/letter'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../system/letter').default,
                exact: true,
              },
              {
                path: '/system/letter/detail/:messageId',
                name: '详情',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__system__letter__model.ts' */ '/Users/grandhonor/grandhonor/smartCommunity-admin/src/pages/system/letter/model.ts').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../system/letter/detail'),
                      LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../system/letter/detail').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/',
            redirect: '/integratedKanban',
            exact: true,
          },
          {
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__404" */ '../404'),
                  LoadingComponent: require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/components/PageLoading/index')
                    .default,
                })
              : require('../404').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: () =>
          React.createElement(
            require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('/Users/grandhonor/grandhonor/smartCommunity-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen = () => {};

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    routeChangeHandler(history.location);
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
