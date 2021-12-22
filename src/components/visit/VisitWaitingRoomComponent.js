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
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from 'reactstrap';
import GenericModal from '../popups/info/GenericModal';
import ProviderPhotoPlaceholder from '../provider/images/provider_photo_placeholder.png';
import VisitWaitingRoomSMSComponent from './VisitWaitingRoomSMSComponent';
import VisitWaitingRoomVCBComponent from './VisitWaitingRoomVCBComponent';
import './VisitComponents.css';
import YesNoModal from '../popups/info/YesNoModal';


class VisitWaitingRoomComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.info('VisitWaitingRoomComponent: props', props);
    this.state = {
      displaySMSInput: false,
      autoTransfer: false,
      firstAvailableTransfer: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.visit.suggestedProviderForTransfer && !prevProps.visit.suggestedProviderForTransfer) {
      this.setState({ autoTransfer: true });
    }
    if (this.props.visit.optionForFindFirstAvailableTransferAvailable && !prevProps.visit.optionForFindFirstAvailableTransferAvailable) {
      this.setState({ firstAvailableTransfer: true });
    }
    if (this.props.isVideoCallbackActive !== prevProps.isVideoCallbackActive ) {
      this.props.onIsVideoCallbackActiveChange(this.props.isVideoCallbackActive);
    }
  }

  componentDidMount() {
    if (this.props.isHeaderMenuDisabled !== true) {
      this.props.updateIsHeaderMenuDisabledCallback(true);
    }
  }

  componentWillUnmount() {
    this.props.updateIsHeaderMenuDisabledCallback(false);
  }

  toggleDisplaySMSInput() {
    this.setState(prevState => ({
      displaySMSInput: !prevState.displaySMSInput,
    }));
  }

  acceptTransfer() {
    this.setState({
      autoTransfer: false,
    }, this.props.acceptTransfer());
  }

  acceptFATransfer() {
    this.setState({
      firstAvailableTransfer: false,
    }, this.props.acceptFATransfer());
  }

  declineTransfer(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({ autoTransfer: false, firstAvailableTransfer: false,
    }, () => {
      this.props.declineTransfer(false);
    });
  }

  declineTransferDontAsk(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({ autoTransfer: false, firstAvailableTransfer: false,
    }, () => {
      this.props.declineTransfer(true);
    });
  }

  render() {
    let providerImage;
    if (this.props.visit.canTransfer) {
      providerImage = this.props.visit.providerForTransfer.hasImage ? this.props.visit.providerForTransfer.logoUrl : ProviderPhotoPlaceholder;
    } else {
      providerImage = this.props.visit.assignedProvider.hasImage ? this.props.visit.assignedProvider.logoUrl : ProviderPhotoPlaceholder;
    }

    let providerModalImage;
    if (this.props.visit.suggestedProviderForTransfer) {
      providerModalImage = this.props.visit.suggestedProviderForTransfer.hasImage ? this.props.visit.suggestedProviderForTransfer.logoUrl : ProviderPhotoPlaceholder;
    }

    let waitingRoomGreeting = this.props.visit.canTransfer ? <FormattedMessage id="transfer_message" values={ { provider: this.props.visit.providerForTransfer.fullName, specialty: this.props.visit.providerForTransfer.specialty.value } } /> : this.props.messages.visit_you_are_next;
    if (!this.props.visit.canTransfer && this.props.visit.patientsAheadOfYou >= 1) {
      waitingRoomGreeting = <FormattedMessage id="waitingRoomGreetingMessage" defaultMessage={ this.props.messages.visit_patients_ahead } values={{ count: this.props.visit.patientsAheadOfYou }}/>;
    }
    const properties = {
      displaySMSInput: this.state.displaySMSInput
    };
    return (
      <div className="visitForm">
        <div id="visitWaitingRoom" className="visitWaitingRoom">
          {this.props.visit.canTransfer && <div id="waitingRoomGreeting" className="waitingRoomGreeting">{waitingRoomGreeting}</div>}
          <div className="waitingRoomProviderLogo"><img alt={this.props.visit.canTransfer ? this.props.visit.providerForTransfer.fullName : this.props.visit.assignedProvider.fullName} src={providerImage}/></div>
          {!this.props.visit.canTransfer &&
            <div>
              <div id="waitingRoomGreeting" className="waitingRoomGreeting">{waitingRoomGreeting}</div>
              <div id="waitingRoomProvider" className="waitingRoomProvider">{this.props.visit.assignedProvider.fullName}, {this.props.visit.assignedProvider.specialty.value}</div>
              {!this.props.displayVCBInput &&
              <div id="visitWaitingRoomMessage" className="visitWaitingRoomMessage">{this.props.messages.visit_your_visit_will_begin}</div>}
            </div>}
          {!this.props.visit.canTransfer && !this.props.displayVCBInput &&
          <div>
            <div className="visitCancelRequest"><button className="link-like" onClick={e => this.props.toggleCancelModal(e)}>{this.props.messages.visit_cancel}</button></div>
            {!this.props.isVideoCallbackActive &&
              <VisitWaitingRoomSMSComponent toggleDisplaySMSInput={this.toggleDisplaySMSInput.bind(this)} {...this.props} {...properties} />
            }
          </div>}
          {!this.props.visit.canTransfer && this.props.displayVCBInput &&
            <VisitWaitingRoomVCBComponent {...this.props} {...properties} />}
        </div>

        {this.props.visit.suggestedProviderForTransfer &&
          <GenericModal className='visitTransferModal' isOpen={this.state.autoTransfer}
            header={this.props.messages.transfer_header}
            message={
              <div className="visitTransferModalBody">
                <div className="transferIntro">{this.props.messages.transfer_auto_intro}</div>
                <div className="transferProvider">
                  <div className="transferProviderLogo"><img alt={this.props.visit.suggestedProviderForTransfer.fullName} src={providerModalImage}/></div>
                  <div className="transferProviderDetails">
                    <div className="transferProviderName">{this.props.visit.suggestedProviderForTransfer.fullName}</div>
                    <div className="transferProviderSpecialty">{this.props.visit.suggestedProviderForTransfer.specialty.value}</div>
                    <div className="transferProviderRating">{'\u2605'.repeat(this.props.visit.suggestedProviderForTransfer.rating)}</div>
                  </div>
                </div>
                <div className="transferQuestion"><FormattedMessage id="transfer_auto_question" values={ { provider: this.props.visit.assignedProvider.fullName } } /></div>
              </div>
            }>
            <div className='visitTransferModalFooter'>
              <Button className="visitTransferButton" onClick={this.acceptTransfer.bind(this)}>
                {this.props.messages.transfer_auto_yes}
              </Button>
              <div className="visitTransferLinks">
                <a href="#nothanks" onClick={this.declineTransfer.bind(this)}>{this.props.messages.transfer_no_thanks}</a><span className="transferSeparator"> | </span><a href="#dontask" onClick={this.declineTransferDontAsk.bind(this)}>{this.props.messages.transfer_dont_ask_again}</a>
              </div>
            </div>
          </GenericModal>
        }

        <GenericModal className='visitTransferModal' isOpen={this.state.firstAvailableTransfer}
          header={this.props.messages.transfer_header}
          message={
            <div className="visitTransferModalBody">
              <div className="transferIntro">{this.props.messages.transfer_fa_intro}</div>
              <div className="transferQuestion">{this.props.messages.transfer_fa_body}</div>
            </div>
          }>
          <div className='visitFATransferModalFooter'>
            <Button className="visitFATransferButton" onClick={this.acceptFATransfer.bind(this)}>
              {this.props.messages.transfer_fa_see_provider_sooner}
            </Button>
            <div className="visitTransferLinks">
              <a href="#nothanks" onClick={this.declineTransfer.bind(this)}>{this.props.messages.transfer_no_thanks}</a><span className="transferSeparator"> | </span><a href="#dontask" onClick={this.declineTransferDontAsk.bind(this)}>{this.props.messages.transfer_dont_ask_again}</a>
            </div>
          </div>
        </GenericModal>

        <YesNoModal
          isOpen={this.props.isCancelModalOpen}
          toggle={this.props.toggleCancelModal}
          messages={this.props.messages}
          header={this.props.messages.cancel_visit}
          message={this.props.messages.cancel_visit_txt}
          yesClickHandler={() => this.props.cancelVisit(this.props.visit)}/>
      </div>
    );
  }
}

VisitWaitingRoomComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  visit: PropTypes.object.isRequired,
};
VisitWaitingRoomComponent.defaultProps = {};
export default VisitWaitingRoomComponent;
