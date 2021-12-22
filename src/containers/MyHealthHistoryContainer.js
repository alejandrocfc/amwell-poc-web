/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2018 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import PropTypes from 'prop-types';
import MyHealthHistoryComponent from '../components/myhealth/MyHealthHistoryComponent';
import { hasContextChanged } from '../components/Util';

class MyHealthHistoryContainer extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyHealthHistoryContainer: props', props);
    this.updateConditions = this.updateConditions.bind(this);
    this.state = {
      conditions: [],
    };
  }

  componentDidMount() {
    this.getConditions();
  }

  componentDidUpdate(prevProps) {
    if (hasContextChanged(this.props, prevProps)) {
      this.getConditions();
    }
  }

  getConditions() {
    this.props.sdk.consumerService.getConditions(this.props.activeConsumer)
      .then((conditions) => {
        this.props.logger.info('Conditions', conditions);
        this.setState({ conditions });
      })
      .catch((reason) => {
        this.props.logger.info('Something went wrong:', reason);
        this.props.showErrorModal();
      });
  }

  updateConditions(e) {
    this.props.enableSpinner();
    const idx = e.target.id.replace(/^\D+/g, '');
    const conditions = this.state.conditions;
    conditions[idx].isCurrent = e.target.checked;
    this.props.sdk.consumerService.updateConditions(this.props.activeConsumer, conditions)
      .then(() => {
        this.setState({ conditions });
      })
      .catch((reason) => {
        this.props.logger.info('Something went wrong:', reason);
        this.props.showErrorModal();
      }).finally(() => {
        this.props.disableSpinner();
      });
  }

  render() {
    const properties = {
      conditions: this.state.conditions,
      updateConditions: this.updateConditions,
    };

    return (
      <MyHealthHistoryComponent key="myHealthHistoryComponent" {...this.props} {...properties} />
    );
  }
}

MyHealthHistoryContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyHealthHistoryContainer.defaultProps = {};
export default MyHealthHistoryContainer;
