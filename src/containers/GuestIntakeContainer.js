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
import awsdk from 'awsdk';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import ValueLinkedContainer from './ValueLinkedContainer';
import GuestIntakeComponent from '../components/guest/GuestIntakeComponent';
import { isValidEmail } from '../components/Util';
import VisitHeader from '../components/visit/VisitHeaderComponent';
import '../components/visit/VisitComponents.css';
import '../components/guest/GuestIntake.css';

class GuestIntakeContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    this.videoInviteId = queryString.parse(props.location.search).videoInviteId;
    this.state = {
      errors: [],
      modified: [],
      guestName: '',
      guestEmail: '',
    };
  }

  submitGuestIntake(e) {
    e.preventDefault();
    this.props.enableSpinner();
    this.props.sdk.visitService.validateGuestInvitation(this.videoInviteId, this.state.guestEmail, this.state.guestName)
      .then((participant) => {
        this.props.history.push('/guestWaiting', { participant: participant.toString() });
      }).catch((error) => {
        this.props.logger.error(error);
        if (error.errorCode === awsdk.AWSDKErrorCode.emailAddressNotFound) {
          this.setState({ errors: { guestEmail: this.props.messages.guest_intake_email_validation_error } });
        } else {
          this.props.showErrorModal();
        }
      })
      .finally(() => this.props.disableSpinner());
  }

  render() {
    const linkedInputs = this.linkAll(['guestName', 'guestEmail']);
    linkedInputs.guestName.check(x => !this.state.modified.guestName || x, this.props.messages.validation_guest_name_required);
    linkedInputs.guestEmail.check(x => !this.state.modified.guestEmail || x, this.props.messages.validation_email_required)
      .check(x => !this.state.modified.guestEmail || isValidEmail(x), this.props.messages.validation_email_invalid);
    const properties = {
      valueLinks: linkedInputs,
      submitGuestIntake: this.submitGuestIntake.bind(this),
      submitDisabled: !this.state.guestName || !isValidEmail(this.state.guestEmail),
    };
    return (
      <VisitHeader id="visitInProgress" icon='visit' title={this.props.messages.welcome}>
        <GuestIntakeComponent {...this.props} {...properties}/>
      </VisitHeader>
    );
  }
}

GuestIntakeContainer.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};

export default GuestIntakeContainer;
