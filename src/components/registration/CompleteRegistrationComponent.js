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
import { Button, Form, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import LegalResidence from '../form/LegalResidenceComponent';
import { Checkbox, EmailInput } from '../form/Inputs';
import Password from '../form/PasswordComponent';

class CompleteRegistrationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('CompleteRegistrationComponent: props', props);
    this.state = {
      tou: false,
    };
  }

  tou(e) {
    if (e) e.preventDefault();
    this.setState({ tou: !this.state.tou });
  }

  render() {
    const legalResidenceLink = this.props.valueLinks.legalResidence;
    const emailLink = this.props.valueLinks.email;
    const confirmEmailLink = this.props.valueLinks.confirmEmail;
    const passwordLink = this.props.valueLinks.password;
    const hasAcceptedDisclaimerLink = this.props.valueLinks.hasAcceptedDisclaimer;

    return (
      <div className="App">
        <div className="registration">
          <div className="registrationHeader">
            <div className="registrationHeaderIcon"></div>
            <div className="registrationHeaderTitle">{this.props.messages.complete_registration}</div>
          </div>
          <Form className="registrationForm">
            <div className="registrationBody">
              <EmailInput tabIndex="8" id="registrationEmail" name="email" valueLink={emailLink} placeholder={this.props.messages.registration_email} />
              <EmailInput tabIndex="9" id="registrationConfirmEmail" name="confirmEmail" valueLink={confirmEmailLink} placeholder={this.props.messages.registration_confirm_email} />
              <Password tabIndex="10" id="registrationPassword" name="password" passwordLink={passwordLink} placeholder={this.props.messages.registration_password} {...this.props} />
              <LegalResidence tabIndex="13" legalResidenceLink={legalResidenceLink} countries={this.props.countries} messages={this.props.messages} {...this.props}/>
              <Checkbox className="TOU" tabIndex="15" checkedLink={hasAcceptedDisclaimerLink} id="registrationTOU" name="hasAcceptedDisclaimer">
                <div className="TOUInputText">
                  <FormattedMessage className="registration_tou" id="registration_tou" defaultMessage={ this.props.messages.registration_tou }
                    values={{ termsofuse: <a href="#tou" onClick={e => this.tou(e)}>{this.props.messages.registration_terms_of_use}</a> }} />
                </div>
              </Checkbox>
            </div>
            <div id="registrationSubmit" className="registrationSubmit">
              <Button tabIndex="20" id="submit" onClick={e => this.props.submitRegistration(e)} className="registrationButton">{this.props.messages.complete_registration_complete}</Button>
            </div>
            <div id="registrationCancel" className="registrationCancel">
              <Link to={'/'}>{this.props.messages.registration_cancel}</Link>
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

CompleteRegistrationComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
CompleteRegistrationComponent.defaultProps = {};
export default CompleteRegistrationComponent;
