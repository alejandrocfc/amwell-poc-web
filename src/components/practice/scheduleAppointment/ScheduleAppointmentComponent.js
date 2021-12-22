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
import { Modal } from 'reactstrap';
import { FormattedDate } from 'react-intl';

import './ScheduleAppointmentComponent.css';
import { AvailabilityPickerComponent } from './AvailabilityPickerComponent';
import ProviderAvailabilityCardComponent from './ProviderAvailabilityCardComponent';
import ProviderAvailabilityDetailsComponent from './ProviderAvailabilityDetailsComponent';

class ScheduleAppointmentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('ScheduleAppointmentContainer: props', props);
  }

  render() {
    return (
      <div className="scheduleAppointmentContainer">
        <AvailabilityPickerComponent {...this.props}/>
        <div>
          <div className="providerAvailabilityDate">
            {this.props.providersAvailability && this.props.providersAvailability.date &&
            <FormattedDate value={this.props.providersAvailability.date} weekday='long' year='numeric' month='long' day='numeric' timeZone='utc'/>}
          </div>
          <div>
            {this.props.providersAvailability && this.props.providersAvailability.futureAvailableProviders.map(p => <ProviderAvailabilityCardComponent key={p.provider.id.persistentId} providerAvailability={p} {...this.props}/>)}
          </div>
        </div>
        <Modal className="providerAvailabilityDetailsModal" toggle={this.props.toggleProviderDetailsModal} isOpen={this.props.showProviderDetails}>
          <div className={this.props.direction} dir={this.props.direction}>
            <div className="close" onClick={this.props.toggleProviderDetailsModal}/>
            {this.props.providerDetails && <ProviderAvailabilityDetailsComponent providerDetails={this.props.providerDetails} {...this.props}/>}
          </div>
        </Modal>
      </div>
    );
  }
}

ScheduleAppointmentComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  calendar: PropTypes.any.isRequired,
  showProviderDetails: PropTypes.bool.isRequired,
  toggleProviderDetailsModal: PropTypes.func.isRequired,
  providersAvailability: PropTypes.object,
  providerDetails: PropTypes.object,
};
ScheduleAppointmentComponent.defaultProps = {};
export default ScheduleAppointmentComponent;
