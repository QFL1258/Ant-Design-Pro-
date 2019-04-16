import React, { Component } from 'react';
//引入链接，connect 链接state 和 view
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
//从 antd 中 引入alert 提示组件
import { Alert } from 'antd';

//引入子组建login 
import Login from '@/components/Login';
//引入css样式
import styles from './Login.less';

//从 Login 中 把UserName, Password, Submit 取出来
const { UserName, Password, Submit } = Login;


//把state和view建立链接
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))

class LoginPage extends Component{
  state = {
    message: '',
  };
  //提交方法
  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    return (
      <div className={styles.main}>
        <Login
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <div>
            {login.message !== undefined && !submitting && this.renderMessage(login.message)}
            <UserName name="account" placeholder="用户名" />
            <Password
              name="pwd"
              placeholder="密码"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}



export default LoginPage;