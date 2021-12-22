/*!
 * American Well Consumer Web SDK
 *
 * Copyright © 2018 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { SpinnerWrapper } from './containers/SpinnerWrapper';

export const PrivateRoute = SpinnerWrapper(({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => {
    if (rest.authenticated) {
      return <Component {...props} {...rest}/>;
    }

    rest.processDeepLink(props.location);
    return <Redirect to={{
      pathname: '/login',
      state: { from: props.location },
    }}/>;
  }}/>
));

export const InitializedRoute = SpinnerWrapper(({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => {
    if (rest.sdk.initialized) {
      return <Component {...props} {...rest}/>;
    }

    rest.processDeepLink(props.location);
    return <Redirect to={{
      pathname: '/welcome',
      state: { from: props.location },
    }}/>;
  }}/>
));

export const PublicRoute = SpinnerWrapper(({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    <Component {...props} {...rest}/>
  )}/>
));
