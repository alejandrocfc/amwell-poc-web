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
import awsdk from 'awsdk';

import Login from '../components/login/LoginComponent';
import LoginMutualAuth from '../components/login/LoginMutualAuthComponent';
import UpdatedTermsOfUse from '../components/login/UpdatedTermsOfUseComponent';
import ValueLinkedContainer from './ValueLinkedContainer';
import CompleteRegistrationContainer from './CompleteRegistrationContainer';
import TwoFactorSetup from '../components/login/TwoFactorSetupComponent';
import TwoFactorLogin from '../components/login/TwoFactorLoginComponent';
import TwoFactorValidation from '../components/login/TwoFactorValidationComponent';
import InformationModal from '../components/popups/info/InformationModal';

class LoginContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    this.sdk = props.sdk;
    this.logger = props.logger;
    this.messages = props.messages;
    const rememberMe = localStorage.getItem('username') !== null;
    const twoFactorTrustedDeviceToken = localStorage.getItem('twoFactorTrustedDeviceToken') || null;
    const twoFactorRequiredAction = props.authentication ? props.authentication.twoFactorInfo.requiredAction : null;
    this.state = {
      outstandingDisclaimer: null,
      hasAcceptedDisclaimer: false,
      needsToCompleteRegistration: false,
      twoFactorRequiredAction: twoFactorRequiredAction,
      twoFactorCodeSent: false,
      authentication: props.authentication,
      username: localStorage.getItem('username') || (window.awsdkconfig && window.awsdkconfig.consumerUsername) || '',
      password: (window.awsdkconfig && window.awsdkconfig.consumerPassword) || '',
      rememberMe,
      phoneNumber: null,
      verificationCode: null,
      rememberDevice: false,
      twoFactorTrustedDeviceToken,
      token: '',
      isDisclaimerModalOpen: false,
      disclaimerText: '',
      errors: [],
      modified: [],
    };
    this.submitAgreeToTerms = this.submitAgreeToTerms.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.submitMutualAuth = this.submitMutualAuth.bind(this);
    this.submitTwoFactorSetup = this.submitTwoFactorSetup.bind(this);
    this.submitTwoFactorValidation = this.submitTwoFactorValidation.bind(this);
    this.sendTwoFactorAuthCode = this.sendTwoFactorAuthCode.bind(this);
    this.submitTwoFactorOptOut = this.submitTwoFactorOptOut.bind(this);
    this.registrationCompletedCallback = this.registrationCompletedCallback.bind(this);
    this.toggleDisclaimerModal = this.toggleDisclaimerModal.bind(this);

    this.enableSpinner = props.enableSpinner;
    this.disableSpinner = props.disableSpinner;
  }

  sendTwoFactorAuthCode(e) {
    this.logger.info('In sendTwoFactorAuthCode');
    e.preventDefault();
    this.enableSpinner();
    this.setState({ errors: {} });
    return this.sdk.authenticationService.sendTwoFactorAuthenticationCode(this.state.authentication)
      .then((updatedAuthentication) => {
        this.setState({
          twoFactorCodeSent: true,
          authentication: updatedAuthentication,
        });
      })
      .catch((error) => this.handleError(error))
      .finally(() => this.disableSpinner());
  }

  submitTwoFactorValidation(e) {
    this.logger.info('In submitTwoFactorValidation');
    e.preventDefault();
    this.enableSpinner();
    return this.sdk.authenticationService.validateTwoFactorAuthenticationCode(this.state.authentication,
      {verificationCode: this.state.verificationCode, rememberThisDevice: this.state.rememberDevice})
      .then((updatedAuthentication) => {
        this.setState({
          twoFactorRequiredAction: updatedAuthentication.twoFactorInfo.requiredAction,
          twoFactorCodeSent: false,
          authentication: updatedAuthentication,
        });
        if (updatedAuthentication.twoFactorInfo.twoFactorTrustedDeviceToken) {
          localStorage.setItem('twoFactorTrustedDeviceToken', updatedAuthentication.twoFactorInfo.twoFactorTrustedDeviceToken);
        }
        if (updatedAuthentication.outstandingDisclaimer != null) {
          this.logger.debug('Terms of use has been updated', updatedAuthentication.outstandingDisclaimer);
          this.setState({ outstandingDisclaimer: updatedAuthentication.outstandingDisclaimer, consumer: updatedAuthentication.consumer });
          return;
        }
        return this.authenticationCompleted(updatedAuthentication);
      })
      .catch((error) => this.handleError(error))
      .finally(() => this.disableSpinner());
  }

  submitTwoFactorOptOut(e) {
    this.logger.info('In submitTwoFactorOptOut');
    if (e) {
      e.preventDefault();
    }
    this.enableSpinner();
    try {
      localStorage.removeItem('twoFactorTrustedDeviceToken');
      this.sdk.authenticationService.optOutTwoFactorAuthentication(this.state.authentication)
          .then((updatedAuthentication) => {
            if (updatedAuthentication.twoFactorInfo.requiredAction === awsdk.AWSDKTwoFactorRequiredAction.NONE) {
              if (updatedAuthentication.outstandingDisclaimer != null) {
                this.logger.debug('Terms of use has been updated', updatedAuthentication.outstandingDisclaimer);
                this.setState({ 
                  outstandingDisclaimer: updatedAuthentication.outstandingDisclaimer, 
                  consumer: updatedAuthentication.consumer
                });
              } else {
                return this.authenticationCompleted(updatedAuthentication);
              }
            }
            this.setState({
              twoFactorRequiredAction: updatedAuthentication.twoFactorInfo.requiredAction,
              authentication: updatedAuthentication,
            });
          })
          .catch((err) => {
            this.disableSpinner();
            this.logger.error('two-factor setup error=', err);
            const errors = {};
            this.props.showErrorModal();
            this.setState({ errors });
          })
          .finally(() => this.disableSpinner());
    } catch (error) {
      this.logger.error('authenticate consumer error=', error);
      this.disableSpinner();
      this.props.showErrorModal();
    }
  }

  submitTwoFactorSetup(e) {
    this.logger.info('In submitTwoFactorSetup');
    if (e) {
      e.preventDefault();
    }
    this.enableSpinner();
    localStorage.removeItem('twoFactorTrustedDeviceToken');
    const strippedPhoneNumber = (this.state.phoneNumber) ? this.state.phoneNumber.replace(/\D/g,'') : '';
    this.sdk.authenticationService.setupTwoFactorAuthentication(this.state.authentication, { phoneNumber: strippedPhoneNumber, optOut: this.state.twoFactorOptOut })
      .then((updatedAuthentication) => {
        // if two factor is optional and they've opted out, we're done
        if (updatedAuthentication.twoFactorInfo.requiredAction === awsdk.AWSDKTwoFactorRequiredAction.NONE) {
          return this.authenticationCompleted(updatedAuthentication);
        }
        this.setState({
          phoneNumber: strippedPhoneNumber.substr(6),
          twoFactorRequiredAction: updatedAuthentication.twoFactorInfo.requiredAction,
          twoFactorCodeSent: true,
          authentication: updatedAuthentication,
        });
      })
      .catch((error) => this.handleError(error))
      .finally(() => this.disableSpinner());
  }

  submitLogin(e) {
    this.logger.info('In submitLogin');
    e.preventDefault();
    this.enableSpinner();
    this.sdk.authenticationService.authenticate(this.state.username, this.state.password, {twoFactorTrustedDeviceToken: this.state.twoFactorTrustedDeviceToken})
      .then((authenticateResponse) => {
        this.logger.info('ok - i got something back from authenticateConsumerWithUsername', authenticateResponse);
        if (this.state.rememberMe) {
          this.logger.debug('RememberMe checked save username to localStorage');
          localStorage.setItem('username', this.state.username);
        } else {
          this.logger.debug('RememberMe unchecked remove username from localStorage');
          localStorage.removeItem('username');
        }
        if (authenticateResponse.outstandingDisclaimer != null) {
          this.logger.debug('Terms of use has been updated', authenticateResponse.outstandingDisclaimer);
          this.setState({ outstandingDisclaimer: authenticateResponse.outstandingDisclaimer, consumer: authenticateResponse.consumer });
          return true;
        }
        if (!authenticateResponse.fullyAuthenticated) {
          if (authenticateResponse.twoFactorInfo.requiredAction && authenticateResponse.twoFactorInfo.requiredAction !== awsdk.AWSDKTwoFactorRequiredAction.NONE) {
            this.setState({authentication: authenticateResponse});
            return true;
          }
          if (authenticateResponse.needsToCompleteRegistration) {
            this.setState({ needsToCompleteRegistration: true, authentication: authenticateResponse });
            return true;
          }
        }
        return this.authenticationCompleted(authenticateResponse);
      })
      .catch((error) => this.handleError(error))
      .finally(() => this.disableSpinner());
  }

  submitMutualAuth(e) {
    this.logger.info('In submitMutualAuth');
    e.preventDefault();
    this.enableSpinner();
    this.sdk.authenticationService.authenticateMutualAuthWithToken(this.state.token)
      .then((authenticateResponse) => {
        if (authenticateResponse.needsToCompleteRegistration) {
          this.setState({ needsToCompleteRegistration: true, authentication: authenticateResponse });
          return true;
        }
        this.logger.info('ok - i got something back from authenticateMutualAuthWithToken', authenticateResponse);
        if (authenticateResponse.outstandingDisclaimer != null) {
          this.disableSpinner();
          this.logger.debug('Terms of use has been updated', authenticateResponse.outstandingDisclaimer);
          this.setState({ outstandingDisclaimer: authenticateResponse.outstandingDisclaimer, consumer: authenticateResponse.consumer });
          return true;
        }
        return this.authenticationCompleted(authenticateResponse);
      })
      .catch((error) => this.handleError(error))
      .finally(() => this.disableSpinner());
  }

  submitAgreeToTerms() {
    if (!this.state.hasAcceptedDisclaimer) {
      const errors = { hasAcceptedDisclaimer: this.messages.validation_has_accepted_disclaimer_required };
      this.setState({ errors });
      return null;
    }
    this.enableSpinner();
    return this.sdk.consumerService.acceptOutstandingDisclaimer(this.state.consumer)
      .then(() => this.sdk.consumerService.getUpdatedConsumer(this.state.consumer))
      .then((consumer) => {
        this.logger.debug('ok - i got the consumer', consumer);
        this.props.consumerAuthenticationCallback(consumer, this.state.authentication);
        this.disableSpinner();
        this.props.history.push('/');
      })
      .catch((error) => this.handleError(error))
      .finally(() => this.disableSpinner());

  }

  authenticationCompleted(authentication) {
    return this.sdk.consumerService.getConsumer(authentication)
      .then((consumer) => {
        this.props.consumerAuthenticationCallback(consumer, authentication);
        return consumer;
      })
      .then(consumer => this.sdk.consumerService.getDependents(consumer))
      .then(dependents => this.props.updateDependentsCallback(dependents))
      .then(() => this.props.getNotifications())
      .then(() => {
        if (sessionStorage.getItem('deeplink')) {
          const deeplink = JSON.parse(sessionStorage.getItem('deeplink'));
          this.logger.info('Processing a deeplink: ', deeplink);
          sessionStorage.removeItem('deeplink');
          this.props.history.push(deeplink.pathname + deeplink.search);
        } else {
          this.props.history.push('/');
        }
      })
      .catch((error) => this.handleError(error))
      .finally(() => this.disableSpinner());
  }

  registrationCompletedCallback(authentication) {
    this.setState({ authentication, needsToCompleteRegistration:false });
  }

  toggleDisclaimerModal(e) {
    if (e) e.preventDefault();
    if (!this.state.isDisclaimerModalOpen) {
      this.enableSpinner();
      this.sdk.authenticationService.getDisclaimer(this.state.authentication).then((disclaimer) => {
        this.setState({
          isDisclaimerModalOpen: true,
          disclaimerText: disclaimer.legalText
        })
      })
      .catch((error) => this.handleError(error))
      .finally(() => this.disableSpinner());
    } else {
      this.setState({isDisclaimerModalOpen: false});
    }
  }

  handleError(error) {
    this.logger.error('handleError: ', error);
    const errors = {};
    if (error instanceof awsdk.AWSDKError) {
      switch (error.errorCode) {
        case awsdk.AWSDKErrorCode.twoFactorAuthenticationExpiredCode:
          errors.verificationCode = this.props.messages.two_factor_error_verification_code_expired;
          break;
        case awsdk.AWSDKErrorCode.twoFactorAuthenticationMaxRetryReached:
          errors.verificationCode = this.props.messages.two_factor_error_verification_code_retry_max;
          break;
        case awsdk.AWSDKErrorCode.twoFactorAuthenticationInvalidCode:
          errors.verificationCode = this.props.messages.two_factor_error_verification_code_invalid;
          break;
        case awsdk.AWSDKErrorCode.twoFactorAuthenticationInvalidPhoneNumber:
          errors.phoneNumber = this.props.messages.two_factor_error_phone_number_required;
          break;
        case awsdk.AWSDKErrorCode.validationRequiredParameterMissing:
        case awsdk.AWSDKErrorCode.validationError:
          if (error.fieldName === 'username') {
            errors.username = this.props.messages.login_error_username_required;
          } else if (error.fieldName === 'password') {
            errors.password = this.props.messages.login_error_password_required;
          } else if (error.fieldName === 'phoneNumber') {
            console.log('setting error for bad / missing phone number');
            errors.phoneNumber = this.props.messages.two_factor_error_phone_number_required;
          } else if (error.fieldName === 'token') {
            errors.token = this.props.messages.login_error_token_required;
          } else if (error.fieldName === 'verificationCode') {
            errors.verificationCode = this.props.messages.two_factor_error_verification_code_invalid;
          }
          break;
        case awsdk.AWSDKErrorCode.authenticationAccessDenied:
          if (this.props.mutualAuthEnabled) {
            errors.token = this.messages.login_error_token_access_denied;
          } else {
            errors.password = this.messages.login_error_access_denied;
          }
          break;
        case awsdk.AWSDKErrorCode.responseError:
          if (this.props.mutualAuthEnabled) {
            errors.token = this.messages.login_error_authentication;
          } else {
            errors.password = this.messages.login_error_authentication;
          }
          break;
        case awsdk.AWSDKErrorCode.authenticationSessionExpired:
          this.props.history.push('/sessionExpired');
          break;
        default:
          this.props.showErrorModal();
      }
    } else {
      this.props.showErrorModal();
    }

    this.setState({ errors });
  }

  render() {
    const hasAcceptedDisclaimerLink = this.linkAt('hasAcceptedDisclaimer');
    const loginLinks = this.linkAll(['username', 'password', 'rememberMe', 'token', 'phoneNumber', 'verificationCode', 'rememberDevice']);
    const twoFactorRequiredAction = this.state.authentication && this.state.authentication.twoFactorInfo ? this.state.authentication.twoFactorInfo.requiredAction : null;

    let componentToDisplay = '';
    if (this.state.needsToCompleteRegistration) {
      componentToDisplay = <CompleteRegistrationContainer
        {...this.props}
        originalUsername={this.state.username}
        originalPassword={this.state.password}
        authentication={this.state.authentication}
        mutualAuthToken={this.state.token}
        registrationCompletedCallback={this.registrationCompletedCallback}/>;
    } else if (this.props.mutualAuthEnabled) {
      loginLinks.token.check(x => !this.state.modified.token || x, this.props.messages.login_error_token_required);
      componentToDisplay = <LoginMutualAuth key='loginMutualAuthComponent' submitMutualAuth={this.submitMutualAuth} valueLinks={loginLinks} {...this.props} />;
    } else if (this.state.twoFactorCodeSent) {
      loginLinks.verificationCode.check(x => !this.state.modified.verificationCode || x, this.props.messages.two_factor_error_verification_code_invalid);
      componentToDisplay = <TwoFactorValidation {...this.props} sendTwoFactorAuthCode={this.sendTwoFactorAuthCode} submitTwoFactorValidation={this.submitTwoFactorValidation} valueLinks={loginLinks} phoneNumber={this.state.phoneNumber} authentication={this.state.authentication}/>;
    } else if (twoFactorRequiredAction === awsdk.AWSDKTwoFactorRequiredAction.SETUP) {
      loginLinks.phoneNumber.check(x => !this.state.modified.phoneNumber || x, this.props.messages.two_factor_error_phone_number_required);
      componentToDisplay = <TwoFactorSetup  {...this.props} twoFactorConfiguration={this.state.authentication.twoFactorInfo.configuration} submitTwoFactorSetup={this.submitTwoFactorSetup} submitTwoFactorOptOut={this.submitTwoFactorOptOut} valueLinks={loginLinks} toggleDisclaimerModal={this.toggleDisclaimerModal}/>;
    } else if (twoFactorRequiredAction === awsdk.AWSDKTwoFactorRequiredAction.LOGIN) {
      componentToDisplay = <TwoFactorLogin  {...this.props} sendTwoFactorAuthCode={this.sendTwoFactorAuthCode} authentication={this.state.authentication} toggleDisclaimerModal={this.toggleDisclaimerModal}/>;
    }  else if (this.state.outstandingDisclaimer !== null) {
      componentToDisplay = <UpdatedTermsOfUse hasAcceptedDisclaimerLink={hasAcceptedDisclaimerLink} outstandingDisclaimer={this.state.outstandingDisclaimer} submitAgreeToTerms={this.submitAgreeToTerms} {...this.props} />;
    } else if (!this.state.authentication || !this.state.authentication.fullyAuthenticated) {
      loginLinks.username.check(x => !this.state.modified.username || x, this.props.messages.login_error_username_required);
      loginLinks.password.check(x => !this.state.modified.password || x, this.props.messages.login_error_password_required);
      componentToDisplay = <Login key='loginComponent' submitLogin={this.submitLogin} valueLinks={loginLinks} {...this.props} />
    }

    return <div>
              {componentToDisplay}
              <InformationModal
                isOpen={this.state.isDisclaimerModalOpen}
                message={this.state.disclaimerText}
                header={this.props.messages.user_agreement}
                messages={this.props.messages}
                buttonText={this.props.messages.ok}
                toggle={this.toggleDisclaimerModal}
                clickHandler={this.toggleDisclaimerModal}
                htmlContent={true}
              />
           </div>;
  }
}

LoginContainer.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  sdk: PropTypes.object.isRequired,
  locale: PropTypes.any.isRequired,
  messages: PropTypes.any.isRequired,
  consumerAuthenticationCallback: PropTypes.func.isRequired,
  mutualAuthEnabled: PropTypes.bool.isRequired,
  logger: PropTypes.object.isRequired,
};

export default LoginContainer;
