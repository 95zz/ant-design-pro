import React from 'react';
import { routerRedux, Switch, Route } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Authorized from './core/utils/Authorized';
import { getQueryPath } from './core/utils/utils';
import UserLayout from './core/layouts/UserLayout';
import BasicLayout from './core/layouts/BasicLayout';
import getConfig, { getUserNav } from './core/common/config';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;

function RouterConfig({ history, app }) {
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route
            path="/user"
            render={props => <UserLayout {...props} routerData={getUserNav(app)} />}
          />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} routerConfig={getConfig(app)} />}
            authority={['admin', 'user']}
            redirectPath={getQueryPath('/user/login', {
              redirect: window.location.href,
            })}
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
