import React, { Component } from 'react';
import { connect } from 'dva';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
import Redirect from 'umi/redirect';

@connect(({ login }) => ({
  currentAuthority: login.currentAuthority,
}))

class AuthorizedWrap extends Component {
  render() {
    const { currentAuthority, children } = this.props;
    const Authority = getAuthority(currentAuthority);
    const Authorized = RenderAuthorized(Authority);
    return (
      <Authorized
        authority={children.props.route.authority}
        noMatch={<Redirect to="/login" />}
      >
        {children}
      </Authorized>
    );
  }
}

export default AuthorizedWrap;
