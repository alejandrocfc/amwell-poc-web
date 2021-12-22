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
import MyHealthTrackerAddComponent from './MyHealthTrackerAddComponent';
import MyHealthTrackerEntriesComponent from './MyHealthTrackerEntriesComponent';
import './MyHealthComponent.css';

class MyHealthTrackerComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyHealthTrackerComponent: props', props);
  }

  render() {
    return (
      <div className="myTrackerTemplateContainer">
        <MyHealthTrackerAddComponent {...this.props} messages={this.props.messages}/>
        <hr />
        <MyHealthTrackerEntriesComponent {...this.props} messages={this.props.messages}/>
      </div>
    );
  }
}

MyHealthTrackerComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyHealthTrackerComponent.defaultProps = {};
export default MyHealthTrackerComponent;
