import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import RendererWrapper0 from '/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/pages/.umi/LocaleWrapper.jsx'
import _dvaDynamic from 'dva/dynamic'

let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/login",
    "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "layouts__UserLayout" */'../../layouts/UserLayout'),
  LoadingComponent: require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/components/PageLoading/index').default,
}),
    "routes": [
      {
        "path": "/login",
        "redirect": "/login/login",
        "exact": true
      },
      {
        "path": "/login/login",
        "name": "login",
        "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Admin__LoginPage" */'../Admin/LoginPage'),
  LoadingComponent: require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/",
    "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "layouts__BasicLayout" */'../../layouts/BasicLayout'),
  LoadingComponent: require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/components/PageLoading/index').default,
}),
    "Routes": [require('../Authorized').default],
    "authority": [
      "admin"
    ],
    "routes": [
      {
        "path": "/",
        "redirect": "/product/product",
        "exact": true
      },
      {
        "path": "/product",
        "name": "product",
        "icon": "shopping",
        "routes": [
          {
            "path": "/product/product",
            "name": "classification",
            "icon": "project",
            "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Product__Product" */'../Product/Product'),
  LoadingComponent: require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/productitem",
            "name": "productitem",
            "icon": "profile",
            "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Product__Productitem" */'../Product/Productitem'),
  LoadingComponent: require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/management",
        "name": "management",
        "icon": "user",
        "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Manage__Manage" */'../Manage/Manage'),
  LoadingComponent: require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/carousel",
        "name": "carousel",
        "icon": "sync",
        "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Carousel__Carousel" */'../Carousel/Carousel'),
  LoadingComponent: require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/orderman",
        "name": "orderman",
        "icon": "database",
        "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Orderman__page" */'../Orderman/page'),
  LoadingComponent: require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/administrator",
        "name": "administrator",
        "icon": "user-add",
        "authority": [
          "superAdmin"
        ],
        "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Administrator__page" */'../Administrator/page'),
  LoadingComponent: require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_routes = routes;
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  window.g_plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper() {
  return (
<RendererWrapper0>
          <Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
        </RendererWrapper0>
  );
}
