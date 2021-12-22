/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2017 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import Loadable from 'react-loading-overlay';

export function SpinnerWrapper(WrappedComponent) {
  return class Spinner extends React.Component {
    constructor(props) {
      super(props);
      this.logger = props.logger;
      this.logger.info('Spinner: props', props);
      this.messages = props.messages;
      this.mounted = false;
      this.state = {
        active: false,
      };
    }

    enableSpinner() {
      this.logger.info('Enable Spinner');
      if (this.mounted) this.setState({ active: true });
    }

    disableSpinner() {
      this.logger.info('Disable Spinner');
      if (this.mounted) this.setState({ active: false });
    }

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      return (
        <Loadable className={this.props.cssClass || 'awsdk-body'} id='spinnerWrapper' color={'rgb(0,188,212)'} spinner={true} active={this.state.active} backgroundColor={'rgba(0, 0, 0, 0.4)'} spinnerSize='100px' zindex='99' >
          <WrappedComponent {...this.props} enableSpinner={this.enableSpinner.bind(this)} disableSpinner={this.disableSpinner.bind(this)} />
        </Loadable>
      );
    }
  };
}
export default {};
