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
import CheckIcon from './images/Check.png';
import ProviderPhotoPlaceholder from '../provider/images/provider_photo_placeholder.png';
import './VisitComponents.css';
import GenericModal from '../popups/info/GenericModal';
import VisitExtensionModal from './VisitExtensionModal';

class VisitInProgressComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.info('VisitInProgressComponent: props', props);
    this.toggleEndVisitModal = this.toggleEndVisitModal.bind(this);
    this.endClicked = this.endClicked.bind(this);
    this.state = {
      isEndVisitModalOpen: false,
    };
  }

  toggleEndVisitModal(event) {
    if (event) {
      event.preventDefault();
    }
    this.setState(prevState => ({ isEndVisitModalOpen: !prevState.isEndVisitModalOpen }));
  }

  endClicked(event) {
    event.preventDefault();
    this.setState(prevState => ({ isEndVisitModalOpen: !prevState.isEndVisitModalOpen }));
    this.props.endVisit(this.props.visit);
  }

  refreshClicked(e) {
    e.preventDefault();
    this.props.launchTelehealthVideo(this.props.visit);
  }

  render() {
    let providerImage = null;
    if (this.props.providerForTransfer) {
      providerImage = this.props.providerForTransfer.hasImage ? this.props.providerForTransfer.logoUrl : ProviderPhotoPlaceholder;
    } else {
      providerImage = CheckIcon;
    }

    const waitingRoomGreeting = this.props.providerForTransfer ? <FormattedMessage id="transfer_message" values={ { provider: this.props.providerForTransfer.fullName, specialty: this.props.providerForTransfer.specialty.value } } /> : null;

    return (
      <div className="visitForm">
        <div id="visitInProgress" className="visitInProgress">
          {this.props.providerForTransfer && <div id="waitingRoomGreeting" className="waitingRoomGreeting">{waitingRoomGreeting}</div>}
          <div className="visitProviderLogo"><img alt={this.props.visit.assignedProvider.fullName} src={providerImage}/></div>
          {!this.props.providerForTransfer &&
            <div>
              <div className="visitProvider">{this.props.visit.assignedProvider.fullName}, {this.props.visit.assignedProvider.specialty.value},</div>
              <div className="visitInProgressMessage">{this.props.messages.visit_ready_to_see_you}</div>
            </div>
          }
          <div className="visitInProgressEndRequest"><button className="link-like" onClick={event => this.toggleEndVisitModal(event)}>{!this.props.providerForTransfer ? this.props.messages.visit_end : this.props.messages.visit_cancel}</button></div>
          {!this.props.providerForTransfer &&
            <div>
              <div className="visitSeparator"><hr /></div>
              <div className="visitInProgressVisitStarted">{this.props.messages.visit_your_visit_started}</div>
              <div className="visitInProgressRefreshVideo"><button className="link-like" onClick={e => this.refreshClicked(e)}>{this.props.messages.visit_refresh_video}</button></div>
            </div>
          }
        </div>
        <GenericModal
          header={this.props.messages.end_visit}
          message={this.props.messages.end_visit_confirmation}
          isOpen={this.state.isEndVisitModalOpen}
          toggle={this.toggleEndVisitModal}>
          <button onClick={this.toggleEndVisitModal}>{this.props.messages.no}</button>
          <button onClick={this.endClicked}>{this.props.messages.yes}</button>
        </GenericModal>
        {this.props.visit.longExtensionEntity &&
        <VisitExtensionModal
          sdk={this.props.sdk}
          messages={this.props.messages}
          visitExtension={this.props.visit.longExtensionEntity}
          providerName={this.props.visit.assignedProvider.fullName}
          showExtendedVisitModal={this.props.showExtendedVisitModal}
          toggleExtendVisitModal={this.props.toggleExtendVisitModal}
          acceptPaidVisitExtension={this.props.acceptPaidVisitExtension}/>}
      </div>
    );
  }
}

VisitInProgressComponent.propTypes = {
  sdk: PropTypes.any.isRequired,
  messages: PropTypes.any.isRequired,
  visit: PropTypes.object.isRequired,
  showExtendedVisitModal: PropTypes.bool.isRequired,
  toggleExtendVisitModal: PropTypes.func.isRequired,
  acceptPaidVisitExtension: PropTypes.func.isRequired,
};
VisitInProgressComponent.defaultProps = {};
export default VisitInProgressComponent;
