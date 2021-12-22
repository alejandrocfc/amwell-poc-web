/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2019 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import PropTypes from 'prop-types';
import MyHealthMeasurementsComponent from '../components/myhealth/MyHealthMeasurementsComponent';
import ValueLinkedContainer from './ValueLinkedContainer';

class MyHealthMeasurementsContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    props.logger.debug('MyHealthMeasurementsContainer: props', props);
    this.state = {
      trackerTemplates: [],
    };
  }

  componentDidMount() {
    this.props.enableSpinner();
    this.props.sdk.searchTrackerTemplates()
      .then((trackerTemplates) => {
        this.props.logger.info('Tracker Templates', trackerTemplates);
        this.setState({
          trackerTemplates,
        });
      })
      .catch((error) => {
        this.props.logger.info('Something went wrong:', error);
        this.props.showErrorModal();
      })
      .finally(() => this.props.disableSpinner());
  }

  handleTrackerTemplateClicked(event, trackerTemplate) {
    if (event) event.preventDefault();
    this.props.logger.debug('Tracker Template Click:', trackerTemplate);
    this.props.history.push('/tracker', { trackerTemplate: trackerTemplate.toString() });
  }

  render() {
    const properties = {
      trackerTemplates: this.state.trackerTemplates,
      onTrackerTemplateClicked: this.handleTrackerTemplateClicked.bind(this),
    };

    return (
      <MyHealthMeasurementsComponent key="myHealthMeasurementsComponent" {...this.props} {...properties} />
    );
  }
}

MyHealthMeasurementsContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyHealthMeasurementsContainer.defaultProps = {};
export default MyHealthMeasurementsContainer;
