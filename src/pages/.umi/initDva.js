import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'carousel', ...(require('/Users/qfl/Desktop/项目/Ant Design Pro练手/Ant-Design-Pro-/my-project/src/models/carousel.js').default) });
app.model({ namespace: 'global', ...(require('/Users/qfl/Desktop/项目/Ant Design Pro练手/Ant-Design-Pro-/my-project/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/Users/qfl/Desktop/项目/Ant Design Pro练手/Ant-Design-Pro-/my-project/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/qfl/Desktop/项目/Ant Design Pro练手/Ant-Design-Pro-/my-project/src/models/login.js').default) });
app.model({ namespace: 'manage', ...(require('/Users/qfl/Desktop/项目/Ant Design Pro练手/Ant-Design-Pro-/my-project/src/models/manage.js').default) });
app.model({ namespace: 'menu', ...(require('/Users/qfl/Desktop/项目/Ant Design Pro练手/Ant-Design-Pro-/my-project/src/models/menu.js').default) });
app.model({ namespace: 'personal', ...(require('/Users/qfl/Desktop/项目/Ant Design Pro练手/Ant-Design-Pro-/my-project/src/models/personal.js').default) });
app.model({ namespace: 'product', ...(require('/Users/qfl/Desktop/项目/Ant Design Pro练手/Ant-Design-Pro-/my-project/src/models/product.js').default) });
app.model({ namespace: 'project', ...(require('/Users/qfl/Desktop/项目/Ant Design Pro练手/Ant-Design-Pro-/my-project/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/qfl/Desktop/项目/Ant Design Pro练手/Ant-Design-Pro-/my-project/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('/Users/qfl/Desktop/项目/Ant Design Pro练手/Ant-Design-Pro-/my-project/src/models/user.js').default) });
