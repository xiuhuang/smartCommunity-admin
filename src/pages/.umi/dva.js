import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'form', ...(require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/models/form.ts').default) });
app.model({ namespace: 'global', ...(require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/models/global.ts').default) });
app.model({ namespace: 'login', ...(require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/models/login.ts').default) });
app.model({ namespace: 'setting', ...(require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/models/setting.ts').default) });
app.model({ namespace: 'uploadImg', ...(require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/models/uploadImg.ts').default) });
app.model({ namespace: 'user', ...(require('/Users/grandhonor/grandhonor/smartCommunity-admin/src/models/user.ts').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
