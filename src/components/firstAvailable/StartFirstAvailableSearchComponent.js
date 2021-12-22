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
import { Button } from 'reactstrap';
import './FirstAvailable.css';
import CartModeButton from '../cartmode/CartModeButton';

const StartFirstAvailableSearchComponent = (props) => {
  props.logger.debug('StartFirstAvailableSearchComponent: props', props);
  return (
    <div className="startFirstAvailable">
      <div className="firstAvailableText">
        <div className="firstAvailablePitch">{props.messages.first_available_pitch}</div>
        <div className="firstAvailableDesc">{props.messages.first_available_pitch_desc}</div>
      </div>
      <div className="firstAvailableAction">
        <Button className="startFirstAvailableSearchButton" onClick={e => props.startFirstAvailableSearch(e)}>{props.messages.first_available_get_started_button}</Button>
      </div>
      <CartModeButton clickHandler={props.startCartMode}/>
    </div>
  );
};

StartFirstAvailableSearchComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  startFirstAvailableSearch: PropTypes.func.isRequired,
  startCartMode: PropTypes.func.isRequired,
};
StartFirstAvailableSearchComponent.defaultProps = {};
export default StartFirstAvailableSearchComponent;
