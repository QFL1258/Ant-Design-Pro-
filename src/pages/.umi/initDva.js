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

app.model({ namespace: 'administrator', ...(require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/models/administrator.js').default) });
app.model({ namespace: 'carousel', ...(require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/models/carousel.js').default) });
app.model({ namespace: 'global', ...(require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/models/global.js').default) });
app.model({ namespace: 'login', ...(require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/models/login.js').default) });
app.model({ namespace: 'manage', ...(require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/models/manage.js').default) });
app.model({ namespace: 'menu', ...(require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/models/menu.js').default) });
app.model({ namespace: 'personal', ...(require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/models/personal.js').default) });
app.model({ namespace: 'product', ...(require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/models/product.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/qfl/Desktop/项目/Ant design_projecct/Ant-Design-Pro-/src/models/setting.js').default) });
