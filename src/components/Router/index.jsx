import React from 'react';
import PropTypes from 'prop-types';
import RouterContext from '../RouterContext';
import { createRouter, listener } from '../../core/router';

class Router extends React.PureComponent {
  static defaultProps = {
    prefix: '/',
    redirect: null,
  };

  static propTypes = {
    redirect: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  };

  constructor(...args) {
    super(...args);
    this.state = {};
    const { prefix } = this.props;
    this.destroyRouter = createRouter({ prefix });
  }

  componentDidmount() {
    if (this.destroyRouter) {
      listener((location) => {
        this.setState({
          location,
        });
      });
    }
  }

  componentWillUnmount() {
    if (this.destroyRouter) {
      this.destroyRouter();
      this.destroyRouter = null;
    }
  }

  render() {
    const { children } = this.props;
    return <RouterContext.Provider value={this.state}>{children}</RouterContext.Provider>;
  }
}

export default Router;
