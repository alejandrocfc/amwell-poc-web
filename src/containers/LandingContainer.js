/*!
 * American Well Consumer Web SDK
 *
 * Copyright (c) 2019 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import awsdk from 'awsdk';
import React from 'react';
import PropTypes from 'prop-types';
import LandingComponent from '../components/landing/LandingComponent';
import YesNoModal from '../components/popups/info/YesNoModal';
import { hasContextChanged } from '../components/Util';

class LandingContainer extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('Landing Container props: ', props);
    this.state = {
      activeVisit: null,
    };
    this.gotoServices = this.gotoServices.bind(this);
    this.toggleShowModal = this.toggleShowModal.bind(this);
    this.rejoinVisit = this.rejoinVisit.bind(this);
    this.endOrCancelActiveVisit = this.endOrCancelActiveVisit.bind(this);
  }

  componentDidMount() {
    this.findActiveVisit();
  }

  componentDidUpdate(prevProps) {
    if (hasContextChanged(this.props, prevProps) && !this.state.activeVisit) {
      this.findActiveVisit();
    }
  }

  findActiveVisit() {
    this.props.enableSpinner();
    return this.props.sdk.visitService.findActiveVisit(this.props.activeConsumer)
      .then((activeVisit) => {
        const newState = {};
        this.props.logger.debug('ActiveVisit: ', activeVisit);
        if (this.props.activeConsumer.id.persistentId !== activeVisit.consumer.id.persistentId) { // visit was for child, so switch it
          this.props.activateConsumer(activeVisit.consumer);
        }
        newState.activeVisit = activeVisit;
        newState.showModal = true;
        this.setState(newState);
      })
      .catch((err) => {
        this.mapError(err);
      })
      .finally(() => this.props.disableSpinner());
  }

  gotoServices() {
    this.props.history.push('/services');
  }

  toggleShowModal() {
    this.setState((prevState) => {
      return ({ showModal: !prevState.showModal });
    });
  }

  endOrCancelActiveVisit() {
    this.props.logger.debug('Ending active visit: ', this.state.activeVisit);
    this.toggleShowModal();
    this.props.enableSpinner();
    if (this.state.activeVisit.disposition === awsdk.AWSDKDisposition.InProgress) {
      this.endActiveVisit();
    } else {
      this.cancelActiveVisit()
    }
  }

  endActiveVisit() {
    return this.props.sdk.visitService.endVisit(this.state.activeVisit)
      .then((updatedVisit) => {
        this.props.logger.debug('Successfully ended active visit', updatedVisit);
        this.setState({ activeVisit: null });
        this.props.history.push('/visit/summary', { visit: updatedVisit.toString()});
      })
      .catch((error) => {
        this.mapError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  cancelActiveVisit() {
    return this.props.sdk.visitService.cancelVisit(this.state.activeVisit)
      .then((updatedVisit) => {
        this.props.logger.debug('Successfully canceled active visit', updatedVisit);
        this.setState({ activeVisit: null });
      })
      .catch((error) => {
        this.mapError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  rejoinVisit() {
    this.props.logger.debug('Attempting to rejoin active visit: ', this.state.activeVisit);
    this.toggleShowModal();
    if (this.state.activeVisit.disposition === awsdk.AWSDKDisposition.PreVisitScreening) {
      return this.props.history.replace('visit/waitingRoom', { visit: this.state.activeVisit.toString() });
    } else { // AWSDKDisposition.inProgress
      if (this.state.activeVisit.isUsingWebRTC) {
        return this.props.history.replace('visit/webRTC', { visit: this.state.activeVisit.toString() });
      } else {
        return this.props.sdk.visitService.launchTelehealthVideo(this.state.activeVisit)
          .then((launchedTelehealthVideo) => {
            this.props.logger.info('Launched telehealth console successfully', launchedTelehealthVideo);
            return this.props.history.replace('visit/waitingRoom', { visit: this.state.activeVisit.toString() });
          }); 
      }
    }
  }

  meetsConditions() {
    return this.state.activeVisit &&
      (this.state.activeVisit.disposition === awsdk.AWSDKDisposition.InProgress ||
        this.state.activeVisit.disposition === awsdk.AWSDKDisposition.PreVisitScreening);
  }

  mapError(error) {
    if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.props.history.push('/sessionExpired');
    } else if (error.errorCode === awsdk.AWSDKErrorCode.visitNotFound) {
      this.props.logger.warn('No active visits found'); // simply log it!
    } else {
      this.props.logger.error('Something went wrong:', error);
      this.props.showErrorModal();
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.meetsConditions() &&
          <YesNoModal
            className='rejoinVisitClass'
            isOpen={this.state.showModal}
            message={this.props.messages.rejoin_visit_body}
            header={this.props.messages.rejoin_visit_header}
            messages={this.props.messages}
            noClickHandler={this.endOrCancelActiveVisit}
            yesClickHandler={this.rejoinVisit}
          />
        }
        <LandingComponent gotoServices={this.gotoServices} {...this.props}/>
      </React.Fragment>
    )
  }
  
}
LandingContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
LandingContainer.defaultProps = {};
export default LandingContainer;
