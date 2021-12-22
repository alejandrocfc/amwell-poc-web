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
import { FormattedTime } from 'react-intl';
import { Table } from 'reactstrap';

import './ScheduleAppointmentComponent.css';


class ProviderAvailabilityTimeSlotsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('ProviderAvailabilityTimeSlotsComponent: props', props);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.state = {
      expanded: false,
    };
  }

  toggleExpanded() {
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }));
  }

  buildTimeSlotsTable(timeSlots, expanded) {
    const rows = [];
    let columns = [];
    const limit = (expanded || timeSlots.length <= 12) ? timeSlots.length : 11;

    // Add the time slots
    for (let i = 0; i < limit; i += 1) {
      columns.push(
        <td key={timeSlots[i]} onClick={() => this.props.handleTimeSlotClick(timeSlots[i])}>
          <FormattedTime value={timeSlots[i]} hour="2-digit" minute="2-digit"/>
        </td>);
      if ((i + 1) % 4 === 0) {
        rows.push(<tr key={timeSlots[i]}>{columns}</tr>);
        columns = [];
      }
    }
    // Add whatever is left in 'columns' as well as the 'more/less' button
    if (timeSlots.length > 12) {
      columns.push(<td key="moreOrLess" onClick={this.toggleExpanded}>{expanded ? this.props.messages.appointments_availability_timeslots_less : this.props.messages.appointments_availability_timeslots_more}</td>);
    }
    rows.push(<tr key="leftOvers">{columns}</tr>);

    return rows;
  }

  render() {
    return (
      <Table bordered>
        <tbody>
          {this.buildTimeSlotsTable(this.props.timeSlots, this.state.expanded)}
        </tbody>
      </Table>
    );
  }
}

ProviderAvailabilityTimeSlotsComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  timeSlots: PropTypes.array.isRequired,
  handleTimeSlotClick: PropTypes.func.isRequired,
};
ProviderAvailabilityTimeSlotsComponent.defaultProps = {};
export default ProviderAvailabilityTimeSlotsComponent;
