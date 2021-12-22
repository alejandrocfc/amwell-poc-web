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
import { Button, Form } from 'reactstrap';
import './MyProfileComponent.css';

import Name from '../form/NameComponent';
import { GenderInput, DateInput } from '../form/Inputs';

class MyProfileDependentDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyProfileDependentDetailComponent: props', props);
  }

  render() {
    const firstNameLink = this.props.valueLinks.firstName;
    const middleNameOrInitialLink = this.props.valueLinks.middleNameOrInitial;
    const lastNameLink = this.props.valueLinks.lastName;
    const genderLink = this.props.valueLinks.gender;
    const genderIdentityLink = this.props.valueLinks.genderIdentity;
    const dobLink = this.props.valueLinks.dob;

    return (
      <Form className="dependentDetailContent">
        <Name tabIndex="1" prefix="dependentEnroll" firstNameLink={firstNameLink} middleNameOrInitialLink={middleNameOrInitialLink} lastNameLink={lastNameLink} {...this.props}/>
        <div className="dependentEnrollDOBTitle">{this.props.messages.registration_date_of_birth}</div>
        <DateInput tabIndex="4" id="dependentEnrollDOB" className="dependentEnrollDOB" valueLink={dobLink} {...this.props}/>
        <GenderInput tabIndex="8" className="dependentEnrollGender" genderLink={genderLink} genderIdentityLink={genderIdentityLink} {...this.props}/>
        {this.props.editMode === 'add' &&
        <div className="dependentEnrollFooter">
          {this.props.messages.dependent_enroll_footer_txt}
        </div>}
        <div className="dependentEnrollButtons">
          <div id="dependentEnrollCancel" className="dependentEnrollCancel">
            <Button tabIndex="10" id="cancel" className="dependentEnrollButton" onClick={() => this.props.disableEditMode()}>{this.props.messages.cancel}</Button>
          </div>
          <div id="dependentEnrollSubmit" className="dependentEnrollSubmit">
            <Button tabIndex="11" id="submit" className="dependentEnrollButton" onClick={() => this.props.submitDependent()} disabled={this.props.formError}>{this.props.messages.save}</Button>
          </div>
        </div>
      </Form>
    );
  }
}

MyProfileDependentDetailComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyProfileDependentDetailComponent.defaultProps = {};
export default MyProfileDependentDetailComponent;
