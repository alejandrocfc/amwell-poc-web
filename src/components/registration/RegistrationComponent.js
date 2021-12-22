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
import { Button, Form, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import LegalResidence from '../form/LegalResidenceComponent';
import PrimaryResidence from '../form/PrimaryResidenceComponent';
import Password from '../form/PasswordComponent';
import Name from '../form/NameComponent';
import { Checkbox, EmailInput, GenderInput, DateInput, PhoneNumberInput } from '../form/Inputs';

import './RegistrationComponent.css';

class RegistrationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('RegistrationComponent: props', props);
    this.state = {
      tou: false,
    };
  }

  tou(e) {
    if (e) e.preventDefault();
    this.setState({ tou: !this.state.tou });
  }

  render() {
    const firstNameLink = this.props.valueLinks.firstName;
    const middleNameOrInitialLink = this.props.valueLinks.middleNameOrInitial;
    const lastNameLink = this.props.valueLinks.lastName;
    const phoneLink = this.props.valueLinks.phone;

    const legalResidenceLink = this.props.valueLinks.legalResidence;
    const genderLink = this.props.valueLinks.gender;
    const genderIdentityLink = this.props.valueLinks.genderIdentity;
    const emailLink = this.props.valueLinks.email;
    const confirmEmailLink = this.props.valueLinks.confirmEmail;
    const passwordLink = this.props.valueLinks.password;

    const dobLink = this.props.valueLinks.dob;
    const sendWelcomeEmailLink = this.props.valueLinks.sendWelcomeEmail;
    const hasAcceptedDisclaimerLink = this.props.valueLinks.hasAcceptedDisclaimer;

    return (
      <div className="App">
        <div className="registration">
          <div className="registrationHeader">
            <div className="registrationHeaderIcon"></div>
            <div className="registrationHeaderTitle">{this.props.messages.registration_create_an_account}</div>
          </div>
          <Form className="registrationForm">
            <div className="registrationBody">
              <Name tabIndex="1" prefix="registration" firstNameLink={firstNameLink} middleNameOrInitialLink={middleNameOrInitialLink} lastNameLink={lastNameLink} {...this.props}/>
              <GenderInput tabIndex="4" className="registrationGender" genderLink={genderLink} genderIdentityLink={genderIdentityLink} {...this.props}/>
              <div className="registrationDOBTitle">{this.props.messages.registration_date_of_birth}</div>
              <DateInput tabIndex="6" id="registrationDOB" className="registrationDOB" valueLink={dobLink} {...this.props}/>
              <EmailInput tabIndex="9" id="registrationEmail" name="email" valueLink={emailLink} placeholder={this.props.messages.registration_email} />
              <EmailInput tabIndex="10" id="registrationConfirmEmail" name="confirmEmail" valueLink={confirmEmailLink} placeholder={this.props.messages.registration_confirm_email} />
              <Password tabIndex="11" id="registrationPassword" name="password" showOptionalHint passwordLink={passwordLink} placeholder={this.props.messages.registration_password_optional} {...this.props} />
              <PhoneNumberInput locale={this.props.locale} tabIndex="12" id="registrationPhoneNumber" name="phone" placeholder={this.props.messages.registration_phone_number} valueLink={phoneLink} />
              <LegalResidence tabIndex="13" countries={this.props.countries} messages={this.props.messages} legalResidenceLink={legalResidenceLink} {...this.props}/>
              {this.props.consumerAddressRequired &&
                <PrimaryResidence tabIndex="15" id="registrationPrimaryAddress" countries={this.props.countries} messages={this.props.messages} valueLinks={this.props.valueLinks} {...this.props} />
              }
              <Checkbox className="sendWelcomeEmail" tabIndex="20" id="registrationWelcomeEmail" name="sendWelcomeEmail" checkedLink={sendWelcomeEmailLink}>
                <div className="sendWelcomeEmailText">
                  { this.props.messages.registration_send_welcome_email }
                </div>
              </Checkbox>
              <Checkbox className="TOU" tabIndex="21" id="registrationTOU" name="hasAcceptedDisclaimer" checkedLink={hasAcceptedDisclaimerLink}>
                <div className="TOUInputText">
                  <FormattedMessage className="registration_tou" id="registration_tou" defaultMessage={ this.props.messages.registration_tou }
                    values={{ termsofuse: <a href="#tou" onClick={e => this.tou(e)}>{this.props.messages.registration_terms_of_use}</a> }} />
                </div>
              </Checkbox>
            </div>
            <div id="registrationSubmit" className="registrationSubmit">
              <Button tabIndex="21" id="submit" className="registrationButton" onClick={e => this.props.submitRegistration(e)}>{this.props.messages.registration_button}</Button>
            </div>
            <div id="registrationCancel" className="registrationCancel">
              <Link to={'/login'}>{this.props.messages.registration_cancel}</Link>
            </div>
          </Form>
          <Modal isOpen={this.state.tou} toggle={this.tou.bind(this)} >
            <div className={this.props.direction} dir={this.props.direction}>
              <ModalHeader toggle={this.tou.bind(this)}>
                {this.props.disclaimer.title}
              </ModalHeader>
              <ModalBody>
                <div dangerouslySetInnerHTML={{ __html: this.props.disclaimer.legalText }} />
              </ModalBody>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

RegistrationComponent.propTypes = {
  isMultiCountry: PropTypes.bool,
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  consumerAddressRequired: PropTypes.bool,
};
RegistrationComponent.defaultProps = {};
export default RegistrationComponent;
