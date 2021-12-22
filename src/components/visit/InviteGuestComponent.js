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
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { EmailInput } from '../form/Inputs';

import './InviteGuestComponent.css';

class InviteGuestComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.info('InviteGuestComponent: props', props);
    this.state = {
      showMoreInfo: false,
    };
  }

  toggleShowMoreInfo(e) {
    if (e) e.preventDefault();
    this.setState(prevState => ({
      showMoreInfo: !prevState.showMoreInfo,
    }));
  }

  render() {
    const invitedGuests = [];
    const size = this.props.guestsToInvite.length;
    this.props.guestsToInvite.forEach((guest) => {
      const id = `invitedGuest-${guest}`;
      invitedGuests.push(
        <div key={id} className="existingInvite">
          <div className="existingInviteEmail">
            {guest}
          </div>
          <div className="removeInviteIcon" onClick={e => this.props.removeGuestEmail(e, guest)}/>
        </div>);
    });
    return (
      <div className="visitIntakeSection visitIntakeInviteGuestComponent">
        <div>{this.props.messages.visit_intake_invite_guests_header}</div>
        {!this.props.maxGuestInvited &&
          <div className="inviteGuestPrompt">
            <div>
              <div>{this.props.messages.visit_intake_invite_guests_subheader}</div>
              <div className="moreInfoIcon" onClick={e => this.toggleShowMoreInfo(e) }/>
            </div>
            <div>{this.props.messages.visit_intake_invite_guests_optional}</div>
          </div>
        }
        {!this.props.showAddGuestInput && !this.props.maxGuestInvited && size < 1 &&
          <button className="link-like" onClick={e => this.props.toggleShowAddGuest(e)}>{this.props.messages.visit_intake_invite_guests_add_guest}</button>
        }
        {invitedGuests && invitedGuests.length > 0 &&
        <div className="existingInviteList">
          {invitedGuests}
        </div>}
        {this.props.showAddGuestInput &&
          <div className="inviteGuestInputContainer">
            <EmailInput className="emailInput" id="visitGuestEmail" name="visitGuestEmail" placeholder={this.props.messages.visit_intake_invite_guests_placeholder} valueLink={this.props.valueLinks.visitGuestEmail}/>
            <Button id="addGuestEmailButton" className="visitButton" onClick={e => this.props.addGuestEmail(e)} disabled={!this.props.isValidGuestEmail}>{this.props.messages.visit_intake_invite_guests_add}</Button>
          </div>
        }
        {!this.props.showAddGuestInput && !this.props.maxGuestInvited && size > 0 &&
          <button className="link-like" onClick={e => this.props.toggleShowAddGuest(e)}>{this.props.messages.visit_intake_invite_guests_add_another}</button>
        }
        {this.props.maxGuestInvited &&
          <div className='inviteGuestMaxGuestsText'>{this.props.messages.visit_intake_max_guests_invited_text}</div>
        }
        <Modal dir={this.props.direction} className={this.props.direction} isOpen={this.state.showMoreInfo} toggle={this.toggleShowMoreInfo.bind(this)}>
          <div className="inviteGuestMoreInfo">
            <ModalHeader className="header">
              {this.props.messages.visit_intake_invite_guests_header}
              <div className="close" onClick={this.toggleShowMoreInfo.bind(this)}/>
            </ModalHeader>
            <ModalBody>
              <div className="description">
                {this.props.messages.visit_intake_invite_guests_more_info}
              </div>
            </ModalBody>
          </div>
        </Modal>
      </div>
    );
  }
}

InviteGuestComponent.propTypes = {
  messages: PropTypes.object.isRequired,
  toggleShowAddGuest: PropTypes.func.isRequired,
  addGuestEmail: PropTypes.func.isRequired,
  removeGuestEmail: PropTypes.func.isRequired,
  direction: PropTypes.any.isRequired,
  valueLinks: PropTypes.any.isRequired,
  showAddGuestInput: PropTypes.bool.isRequired,
};

export default InviteGuestComponent;
