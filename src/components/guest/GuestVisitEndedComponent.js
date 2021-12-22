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
import VisitHeader from '../visit/VisitHeaderComponent';

const GuestVisitEndedComponent = props => (
  <div>
    <VisitHeader id="visitEnded" icon='ended' title={props.messages.guest_visit_the_visit}>
      <div className="visitForm">
        <div className="visitEnded">
          {props.location.state.message}
        </div>
        <div id="visitEndedSubmit" className="visitSubmit">
          <Button className='visitButton' onClick={() => { props.history.push('/'); }}>{props.messages.ok}</Button>
        </div>
      </div>
    </VisitHeader>
  </div>
);


GuestVisitEndedComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
GuestVisitEndedComponent.defaultProps = {};

export default GuestVisitEndedComponent;
