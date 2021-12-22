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
import PropTypes from 'prop-types';
import { FormGroup } from 'reactstrap';
import ValueLink from 'valuelink';
import { TextInputRaw } from '../form/Inputs';

class NameComponent extends React.Component {
  render() {
    this.props.logger.debug('Properties: ', this.props);
    const firstNameLink = this.props.firstNameLink;
    const middleNameOrInitialLink = this.props.middleNameOrInitialLink;
    const lastNameLink = this.props.lastNameLink;
    const tabIndex = this.props.tabIndex;
    const prefix = this.props.prefix;
    const firstNameDisabled = this.props.firstNameDisabled;
    const middleNameDisabled = this.props.middleNameDisabled;
    const middleInitialDisabled = this.props.middleInitialDisabled;
    const lastNameDisabled = this.props.lastNameDisabled;

    return (
      <FormGroup className={`${prefix}NameGroup`}>

        {(this.props.consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.NONE || this.props.consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.FULLNAME) &&
        <div>
          <TextInputRaw tabIndex={tabIndex} id={`${prefix}FirstName`} className={`${prefix}FirstName`} name="firstName" placeholder={this.props.messages.name_first_name} valueLink={firstNameLink} disabled={firstNameDisabled}/>
          {firstNameLink.error &&
          <div className='error'>{firstNameLink.error}</div>}
        </div>}

        {this.props.consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.FULLNAME &&
        <div>
          <TextInputRaw tabIndex={1 + Number(tabIndex)} id={`${prefix}MiddleName`} className={`${prefix}MiddleName`} name="middleName" placeholder={this.props.messages.name_middle_name} valueLink={middleNameOrInitialLink} disabled={middleNameDisabled}/>
          {middleNameOrInitialLink.error &&
          <div className='error'>{middleNameOrInitialLink.error}</div>}
        </div>}

        {this.props.consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.INITIAL &&
        <div>
          <TextInputRaw tabIndex={tabIndex} id={`${prefix}FirstNameWithMI`} className={`${prefix}FirstNameWithMI`} name="firstName" placeholder={this.props.messages.name_first_name} valueLink={firstNameLink} disabled={firstNameDisabled}/>
          <TextInputRaw tabIndex={1 + Number(tabIndex)} id={`${prefix}MiddleInitial`} className={`${prefix}MiddleInitial`} name="middleInitial" placeholder={this.props.messages.name_middle_initial} valueLink={middleNameOrInitialLink} disabled={middleInitialDisabled} maxLength="1"/>
          {firstNameLink.error &&
          <div className='error'>{firstNameLink.error}</div>}
          {middleNameOrInitialLink.error &&
          <div className='error'>{middleNameOrInitialLink.error}</div>}
        </div>}

        <TextInputRaw tabIndex={2 + Number(tabIndex)} id={`${prefix}LastName`} className={`${prefix}LastName`} name="lastName" placeholder={this.props.messages.name_last_name} valueLink={lastNameLink} disabled={lastNameDisabled}/>
        {lastNameLink.error &&
        <div className='error'>{lastNameLink.error}</div>}

      </FormGroup>
    );
  }
}

NameComponent.propTypes = {
  firstNameLink: PropTypes.instanceOf(ValueLink).isRequired,
  middleNameOrInitialLink: PropTypes.instanceOf(ValueLink).isRequired,
  lastNameLink: PropTypes.instanceOf(ValueLink).isRequired,
  consumerMiddleNameHandling: PropTypes.isRequired,
  prefix: PropTypes.string.isRequired,
  tabIndex: PropTypes.string.isRequired,
  messages: PropTypes.any.isRequired,
};

export default NameComponent;
