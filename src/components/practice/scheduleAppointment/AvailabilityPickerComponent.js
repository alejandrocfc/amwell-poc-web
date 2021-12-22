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
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';

import 'react-day-picker/lib/style.css';
import './AvailabilityPickerComponent.css';

export class AvailabilityPickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('AvailabilityPickerComponent: props', props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.state = {
      currentMonthIndex: 1,
      selectedDay: new Date(),
      firstSelectableDay: null,
    };
  }

  componentDidUpdate(previousProps, previousState) {
    if (this.props.calendar.length !== previousProps.calendar.length && this.props.calendar.length === 2 && this.state.firstSelectableDay === previousState.firstSelectableDay && previousState.firstSelectableDay === null ) {
      const nextAvailableDay = this.findNextAvailableDay();
      this.setState({ selectedDay: nextAvailableDay, firstSelectableDay: nextAvailableDay });
      this.props.getProvidersWithAvailability(nextAvailableDay);
    }
  }

  findNextAvailableDay() {
    let day = new Date();
    let updatedDay = this.props.calendar[this.state.currentMonthIndex - 1] && this.props.calendar[this.state.currentMonthIndex - 1].availabilityList[0];
    if (!updatedDay) {
      updatedDay = this.props.calendar[this.state.currentMonthIndex] && this.props.calendar[this.state.currentMonthIndex].availabilityList[0];
      if (updatedDay) {
        day = updatedDay;
      }
    } else {
      day = updatedDay;
    }
    return day;
  }

  moveToNextMonth() {
    if (this.state.currentMonthIndex < 6) {
      if (!this.props.calendar[this.state.currentMonthIndex + 1]) {
        const lastDate = this.props.calendar[this.state.currentMonthIndex].date;
        const nextMonth = new Date(lastDate.getUTCFullYear(), lastDate.getUTCMonth() + 1);
        this.props.getPracticeFutureAvailability(nextMonth);
      }
      this.setState(prevState => ({ currentMonthIndex: prevState.currentMonthIndex + 1 }));
    }
  }

  moveToPreviousMonth() {
    if (this.state.currentMonthIndex > 1) {
      this.setState(prevState => ({ currentMonthIndex: prevState.currentMonthIndex - 1 }));
    }
  }

  compareDatesNoTime(date1, date2) {
    return new Date(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate()).getTime()
      - new Date(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate()).getTime();
  }

  handleDayClick(day, { highlighted }) {
    if (highlighted && day) {
      this.setState({ selectedDay: day });
      this.props.getProvidersWithAvailability(day);
    }
  }

  render() {
    const today = new Date();
    const sixmo = new Date(new Date().setMonth(today.getMonth() + 6));
    const disabledDays = { before: this.state.firstSelectableDay, after: sixmo };
    const calendars = [];
    let index = this.state.currentMonthIndex - 1;
    for (index; index < this.state.currentMonthIndex + 1; index += 1) {
      const availability = this.props.calendar[index];
      if (availability) {
        const modifiers = {
          highlighted: date => availability.availabilityList.find(available => this.compareDatesNoTime(sixmo, date) >= 0 && this.compareDatesNoTime(date, available) === 0 && date.getUTCMonth() === availability.date.getUTCMonth()),
          selected: date => this.state.selectedDay != null && this.compareDatesNoTime(date, this.state.selectedDay) === 0 && date.getUTCMonth() === availability.date.getUTCMonth(),
        };
        calendars.push(
          <DayPicker
            fixedWeeks
            disabledDays={disabledDays}
            onDayClick={this.handleDayClick}
            key={availability.date.getTime()}
            modifiers={modifiers}
            month={availability.date}
            canChangeMonth={false}
            localeUtils={MomentLocaleUtils}
            locale={this.props.messages.momentjs_locale} />);
      }
    }

    return (
      <div className="availabilityCalendar">
        <div className={`arrow arrow-left ${this.state.currentMonthIndex > 1 ? 'arrow-enabled' : ''}`} onClick={this.moveToPreviousMonth.bind(this)}/>
        <div className="calendarContainer">
          {calendars}
        </div>
        <div className={`arrow arrow-right ${this.state.currentMonthIndex < 6 ? 'arrow-enabled' : ''}`} onClick={this.moveToNextMonth.bind(this)}/>
      </div>
    );
  }
}

AvailabilityPickerComponent.propTypes = {
  calendar: PropTypes.any.isRequired,
};

export class Availability {
  constructor(date, availabilityList) {
    this.date = date;
    this.availabilityList = availabilityList;
  }
}
