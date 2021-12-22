/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2020 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */
import awsdk from 'awsdk';
import React, { Component } from 'react';
import { Form, FormGroup, Button, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { TextInput } from '../form/Inputs';
import YesNoModal from '../popups/info/YesNoModal';
import { formatPhoneNumber } from '../Util';

import './Login.css';
import './TwoFactor.css';

class TwoFactorSetupComponent extends Component {

  constructor(props) {
    super(props);
    props.logger.info('TwoFactorSetupComponent: props', props);
    const isOptionalModalOpen = this.props.twoFactorConfiguration === awsdk.AWSDKTwoFactorConfiguration.OPTIONAL;
    this.state = { isOptionalModalOpen };
    this.toggleOptionalModal = this.toggleOptionalModal.bind(this);
  }

  toggleOptionalModal(e) {
    if (e) e.preventDefault();
    this.setState(prevState => ({
      isOptionalModalOpen: !prevState.isOptionalModalOpen,
    }));
  }

  render() {
    const phoneNumberLink = this.props.valueLinks.phoneNumber;
    return (
      <div id="login" className="twoFactor">
        <div className='loginForm'>
          <div className="headerBar"/>
          <Form className="formGroupContent" onSubmit={this.props.submitTwoFactorSetup}>
            <FormGroup>
              <h1>{this.props.messages.two_factor_setup_header}</h1>
              <div className="twoFactorMessage">{this.props.messages.two_factor_setup_message}</div>

              <div className='formSpacing'>
                <Label for="phoneNumber">{this.props.messages.two_factor_setup_number_label}</Label>
                <TextInput name="phoneNumber" id="phoneNumber"
                           placeholder={this.props.messages.two_factor_setup_number_prompt}
                           valueLink={phoneNumberLink}
                           onInput={(e) => {e.target.value = formatPhoneNumber(e.target.value)}}
                />
              </div>
              <div className="twoFactorDetails">
                <FormattedMessage id="twoFactorDetails" defaultMessage={this.props.messages.two_factor_setup_details} />
              </div>
              <div className="formSpacing">
                <Button color="success" id="submit">{this.props.messages.two_factor_submit}</Button>
              </div>
            </FormGroup>
            {
              this.props.twoFactorConfiguration === awsdk.AWSDKTwoFactorConfiguration.OPTIONAL &&
              <div className="formSpacing skipVerification">
                <Button className="linkLike skipVerificationLink" type="button" onClick={this.props.submitTwoFactorOptOut}>
                  {this.props.messages.two_factor_skip_verification}
                </Button>
              </div>
            }
            <div className="formSpacing twoFactorFooter">
              <Button type="button" className="twoFactorFooterButton" onClick={this.props.toggleDisclaimerModal}>{this.props.messages.two_factor_terms_of_use}</Button>
              <span className="footerSeparator"/>
              <Button type="button" className="twoFactorFooterButton" onClick={this.props.toggleDisclaimerModal}>{this.props.messages.two_factor_privacy_policy}</Button>
            </div>
          </Form>
        </div>
        <YesNoModal
          isOpen={this.state.isOptionalModalOpen}
          message={this.props.messages.two_factor_optional_message}
          header={this.props.messages.two_factor_login_header}
          messages={this.props.messages}
          buttonText={this.props.messages.close}
          toggle={this.toggleOptionalModal}
          noClickHandler={() => {
            this.toggleOptionalModal();
            this.props.submitTwoFactorOptOut();
          }}
          yesClickHandler={this.toggleOptionalModal}/>
      </div>
    );
  }
}

TwoFactorSetupComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  submitTwoFactorSetup: PropTypes.func.isRequired,
  submitTwoFactorOptOut: PropTypes.func.isRequired,
  valueLinks: PropTypes.object.isRequired,
  twoFactorConfiguration: PropTypes.string.isRequired,
  toggleDisclaimerModal: PropTypes.func.isRequired,
};

export default TwoFactorSetupComponent;
