import { Spin } from 'antd';
import Loadable from 'react-loadable';
import React, { createElement } from 'react';

// 判断model是否已存在
const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace.toLowerCase() === model.substring(model.lastIndexOf('/') + 1).toLowerCase();
  });
// model包装器
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../../app/${model}`).default);
    }
  });
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      // if (!routerDataCache) {
      //   routerDataCache = getRouterData(app);
      // }
      return createElement(component().default, {
        ...props,
        // routerData: routerDataCache,
      });
    };
  }
  return Loadable({
    loader: () => {
      // if (!routerDataCache) {
      //   routerDataCache = getRouterData(app);
      // }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            // routerData: routerDataCache,
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

export default function getConfig(app) {
  return {
    '/': {
      component: dynamicWrapper(app, ['login/model/user', 'login/model/login'], () =>
        import('../layouts/BasicLayout')
      ),
    },
    '/sys/organization': {
      name: '组织管理',
      component: dynamicWrapper(app, ['sys/organization/model/Organization'], () =>
        import('../../app/sys/organization/route/Index')
      ),
    },
    '/sys/module': {
      name: '模块管理',
      component: dynamicWrapper(app, ['sys/module/model/Module'], () =>
        import('../../app/sys/module/route/Index')
      ),
    },
    '/sys/account': {
      name: '用户管理',
      component: dynamicWrapper(app, ['sys/account/model/Account'], () =>
        import('../../app/sys/account/route/Index')
      ),
    },
    '/sys/role': {
      name: '角色授权管理',
      component: dynamicWrapper(app, ['sys/role/model/Role'], () =>
        import('../../app/sys/role/route/Index')
      ),
    },
    '/sys/dictionary': {
      name: '字典管理',
      component: dynamicWrapper(app, ['sys/dictionary/model/Dict'], () =>
        import('../../app/sys/dictionary/route/Index')
      ),
    },
    '/monitor/druid': {
      name: 'Druid监控',
      component: dynamicWrapper(app, [], () => import('../../app/monitor/Druid')),
    },
    '/monitor/swagger': {
      name: 'Swagger',
      component: dynamicWrapper(app, [], () => import('../../app/monitor/Swagger')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../../app/error/route/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../../app/error/route/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../../app/error/route/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error/model/error'], () =>
        import('../../app/error/route/triggerException')
      ),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login/model/login'], () =>
        import('../../app/login/route/Login')
      ),
    }
  };
}

export function getUserNav(app) {
  return {
    '/user/login': {
      component: dynamicWrapper(app, ['login/model/login'], () =>
        import('../../app/login/route/Login')
      ),
    },
  };
}
