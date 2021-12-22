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
import MyHealthAllergiesComponent from '../components/myhealth/MyHealthAllergiesComponent';
import { hasContextChanged } from '../components/Util';

class MyHealthAllergiesContainer extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyHealthAllergiesContainer: props', props);
    this.updateAllergies = this.updateAllergies.bind(this);
    this.state = {
      allergies: [],
    };
  }

  componentDidMount() {
    this.getAllergies();
  }

  componentDidUpdate(prevProps) {
    if (hasContextChanged(this.props, prevProps)) {
      this.getAllergies();
    }
  }

  getAllergies() {
    this.props.sdk.consumerService.getAllergies(this.props.activeConsumer)
      .then((allergies) => {
        this.props.logger.info('Allergies', allergies);
        this.setState({ allergies });
      })
      .catch((reason) => {
        this.props.logger.info('Something went wrong:', reason);
        this.props.showErrorModal();
      });
  }

  updateAllergies(e) {
    this.props.enableSpinner();
    const idx = e.target.id.replace(/^\D+/g, '');
    const allergies = this.state.allergies;
    allergies[idx].isCurrent = e.target.checked;
    this.props.sdk.consumerService.updateAllergies(this.props.activeConsumer, allergies)
      .then(() => {
        this.setState({ allergies });
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
      allergies: this.state.allergies,
      updateAllergies: this.updateAllergies,
    };

    return (
      <MyHealthAllergiesComponent key="myHealthAllergiesComponent" {...this.props} {...properties} />
    );
  }
}

MyHealthAllergiesContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyHealthAllergiesContainer.defaultProps = {};
export default MyHealthAllergiesContainer;
