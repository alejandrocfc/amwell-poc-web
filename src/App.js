/*!
 * American Well Consumer Web SDK
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
import { IntlProvider } from 'react-intl';
import queryString from 'query-string';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import awsdk from 'awsdk';
import * as log from 'loglevel';

import Welcome from './containers/WelcomeContainer';
import Login from './containers/LoginContainer';
import Setup from './containers/SetupContainer';
import Registration from './containers/RegistrationContainer';
import Footer from './components/footer/FooterComponent';
import Landing from './containers/LandingContainer';
import Services from './containers/ServicesContainer';
import Appointments from './containers/AppointmentsContainer';
import AppointmentDetails from './containers/AppointmentDetailsContainer';
import ConfirmAppointment from './containers/ConfirmAppointmentContainer';
import PastProviders from './containers/PastProvidersContainer';
import TestMyComputer from './containers/TestMyComputerContainer';
import Practice from './containers/PracticeContainer';
import FirstAvailable from './containers/FirstAvailableContainer';
import VisitCost from './containers/VisitCostContainer';
import VisitEnded from './containers/VisitEndedContainer';
import VisitInProgress from './containers/VisitInProgressContainer';
import VisitIntake from './containers/VisitIntakeContainer';
import VisitSummary from './containers/VisitSummaryContainer';
import VisitWaitingRoom from './containers/VisitWaitingRoomContainer';
import LoginAssistance from './components/login/LoginAssistanceComponent';
import UsernameAssistance from './containers/UsernameAssistanceContainer';
import PasswordAssistance from './containers/PasswordAssistanceContainer';
import PasswordResetEnded from './components/login/PasswordResetEndedComponent';
import Logout from './components/LogoutComponent';
import SessionExpired from './components/SessionExpiredComponent';
import NoMatchComponent from './components/NoMatchComponent';
import { getLanguage } from './components/Util';
import WebRTCVisitContainer from './containers/WebRTCVisitContainer';
import MyMessages from './containers/MyMessagesContainer';
import GuestIntake from './containers/GuestIntakeContainer';
import GuestWaitingRoom from './containers/GuestVisitWaitingRoomContainer';
import GuestVisitInProgress from './containers/GuestVisitInProgressContainer';
import GuestVisitWebRTCInProgress from './containers/GuestVisitWebRTCInProgressContainer';
import GuestVisitEnded from './components/guest/GuestVisitEndedComponent';
import CartMode from './containers/CartmodeContainer';
import VisitPhoneWaitingRoom from './containers/VisitPhoneWaitingRoomContainer';
import VisitPhoneInProgress from './containers/VisitPhoneInProgressContainer';

import { InitializedRoute, PrivateRoute, PublicRoute } from './routes';

import i18n from './i18n/index';

import './App.css';
import InformationModal from './components/popups/info/InformationModal';
import MyProfileContainer from './containers/MyProfileContainer';
import MyHealthContainer from './containers/MyHealthContainer';
import MyHealthTrackerContainer from './containers/MyHealthTrackerContainer';
import MyRecordsContainer from './containers/MyRecordsContainer';


class App extends React.Component {
  constructor(props) {
    super(props);
    const loggerConfig = window.sampleAppLoggerConfig || { name: 'SampleAppLogger', level: 'error' };
    this.logger = log.getLogger('SampleApp');
    this.logger.setDefaultLevel(loggerConfig.level);
    this.logger.info('App props', props);
    const awsdkLoggerConfig = window.awsdkLoggerConfig || { name: 'AWSDKLogger', level: 'error' };
    const sdk = new awsdk.AWSDK(awsdkLoggerConfig);
    const savedSdkState = sessionStorage.getItem('sdk');
    if (savedSdkState) {
      sdk.restoreInstanceState(savedSdkState);
    }
    this.saveState = this.saveState.bind(this);
    this.updateDependentsCallback = this.updateDependentsCallback.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.enableNotificationsBox = this.enableNotificationsBox.bind(this);
    this.disableNotificationsBox = this.disableNotificationsBox.bind(this);
    this.hideAccessRequestOnBell = this.hideAccessRequestOnBell.bind(this);
    this.hideAppointmentsOnBell = this.hideAppointmentsOnBell.bind(this);
    this.hideSecureMessagesOnBell = this.hideSecureMessagesOnBell.bind(this);
    this.changeLocale = this.changeLocale.bind(this);
    this.consumerAuthenticationCallback = this.consumerAuthenticationCallback.bind(this);
    this.partiallyAuthenticatedCallback = this.partiallyAuthenticatedCallback.bind(this);
    this.consumerLogoutCallback = this.consumerLogoutCallback.bind(this);
    this.sdkInitialized = this.sdkInitialized.bind(this);
    this.consumerUpdated = this.consumerUpdated.bind(this);
    this.activateConsumer = this.activateConsumer.bind(this);
    this.setIsSimpleHeader = this.setIsSimpleHeader.bind(this);
    this.processDeepLink = this.processDeepLink.bind(this);
    this.showErrorModal = this.showErrorModal.bind(this);
    this.handleError = this.handleError.bind(this);
    this.updateIsHeaderMenuDisabledCallback = this.updateIsHeaderMenuDisabledCallback.bind(this);
    this.setCartModeActive = this.setCartModeActive.bind(this);
    const consumer = awsdk.AWSDKFactory.restoreConsumer(sessionStorage.getItem('consumer'));
    const activeConsumer = awsdk.AWSDKFactory.restoreConsumer(sessionStorage.getItem('activeConsumer'));
    const authentication = awsdk.AWSDKFactory.restoreAuthentication(sessionStorage.getItem('authentication'));
    let locale = sessionStorage.getItem('locale');
    let direction = sessionStorage.getItem('direction');
    if (locale == null) {
      locale = 'en_US';
      direction = 'ltr';
    }
    const messages = i18n[getLanguage(locale)];
    this.state = {
      sdk,
      consumer,
      activeConsumer,
      authentication,
      authenticated: sessionStorage.getItem('authenticated') === 'true',
      messages,
      supportedLocales: props.supportedLocales,
      locale,
      direction,
      error: false,
      errorMessage: null,
      errorHeader: null,
      dependents: [],
      hasAppointmentReminder: false,
      hasSecureMessage: false,
      hasDependentRequest: false,
      displayNotifications: false,
      isHeaderMenuDisabled: false,
      isSimpleHeader: sessionStorage.getItem('isSimpleHeader') === true || false,
      isCartModeActive: sessionStorage.getItem('isCartModeActive') === true || false,
      genderSupportEnabled: false,
      supportedGenderIdentities: []
    };
  }

  UNSAFE_componentWillMount() {
    const locale = this.determineLocale();
    const direction = this.getLanguageDirection(locale);
    if (locale !== this.state.locale || direction !== this.state.direction) {
      this.logger.info('changing locale to ', locale);
      this.changeLocale(locale);
    }
    else {
      this.setPageLang();
    }
  }

  componentDidMount() {
    this.timer = setInterval(this.saveState, 120000);
    this.notifications = setInterval(this.getNotifications, 120000);
    this.fetchDependents();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.notifications);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const localeChanged = this.state.locale !== prevState.locale;
    const docDIR = document.dir;
    if (localeChanged && docDIR !== this.state.direction) {
      this.setPageLang();
    }
  }

  setPageLang() {
    document.dir = this.state.direction;
    document.documentElement.lang =
        this.state.direction === 'ltr' ? 'en' : 'iw';
  }

  fetchDependents() {
    const consumer = this.state.consumer;
    const authenticated = this.state.authenticated;
    if (authenticated && consumer) {
      this.state.sdk.consumerService.getDependents(consumer)
          .then((dependents) => {
            this.logger.log('Found dependents', dependents);
            this.setState({ dependents });
          })
          .catch((err) => {
            // just log it here. Will eventually be caught in another (more context meaningful) call
            this.logger.error('Found error fetching dependents: ', err);
          });
      // don't want to couple these two calls
      // need this to update the notifications icon immediately
      this.getNotifications();
    }
  }

  determineLocale() {
    // first look for an override in the query string
    const queryStringLocale = queryString.parse(window.location.search).language;
    if (queryStringLocale !== undefined && this.state.supportedLocales.includes(queryStringLocale)) {
      this.logger.info('setting locale from query string', queryStringLocale);
      return queryStringLocale;
    }

    const sessionLocale = sessionStorage.getItem('locale');
    if (sessionLocale) {
      this.logger.info('setting locale from session', sessionLocale);
      return sessionLocale;
    }

    // fallback to the navigator locale
    const navigatorLanguage = window.navigator.language.length > 2 ? window.navigator.language.substring(0, 2) : window.navigator.language;
    if (navigatorLanguage !== undefined) {
      let navigatorLocale = null;
      this.state.supportedLocales.forEach((locale) => {
        if (getLanguage(locale) === navigatorLanguage) {
          navigatorLocale = locale;
        }
      });
      if (navigatorLocale) {
        this.logger.info('setting locale from navigator', navigatorLocale);
        return navigatorLocale;
      }
    }

    // use current locale
    this.logger.debug('current locale', this.state.locale);
    return this.state.locale;
  }

  getLanguageDirection(locale) {
    if (locale === 'iw_IL') {
      this.logger.info('language direction rtl');
      return 'rtl';
    }
    return 'ltr';
  }

  consumerAuthenticationCallback(consumer, authentication) {
    if (consumer != null) {
      this.setState({ authenticated: true, consumer, activeConsumer: consumer, authentication }, () => { this.saveState(); this.fetchDependents(); });
    }
  }

  partiallyAuthenticatedCallback(authentication) {
    if (authentication != null) {
      this.setState({authenticated: false, authentication});
    }
  }

  consumerLogoutCallback() {
    this.setState({ authenticated: false, activeConsumer: null, consumer: null, dependents: null, authentication: null }, () => { this.saveState(); this.clearState(); });
    return true;
  }

  consumerUpdated(consumer) {
    this.logger.debug('consumer updated', consumer);
    if (consumer != null) {
      const newState = {};
      if (this.state.consumer.id.persistentId === consumer.id.persistentId) {
        newState.consumer = consumer;
      }
      if (this.state.activeConsumer.id.persistentId === consumer.id.persistentId) {
        newState.activeConsumer = consumer;
      }
      this.setState(newState, () => this.saveState());
    }
  }

  updateDependentsCallback(dependents) {
    this.logger.debug('Updating dependents: ', dependents);
    this.setState({ dependents });
  }

  updateIsHeaderMenuDisabledCallback(isHeaderMenuDisabled) {
    this.logger.debug('Updating header menu disabled state: ', isHeaderMenuDisabled);
    this.setState({ isHeaderMenuDisabled });
  }

  activateConsumer(activeConsumer) {
    this.logger.info('Found activeConsumer: ', activeConsumer);
    if (activeConsumer != null) {
      this.setState({ activeConsumer }, () => { this.saveState(); });
    }
  }


  changeLocale(locale) {
    if (this.state.sdk.initialized) {
      this.state.sdk.changeLocale(locale)
          .then((response) => {
            if (response) {
              this.logger.info('Re-initialized SDK for:', locale);
              const direction = this.getLanguageDirection(locale);
              this.setState({ locale, direction, messages: i18n[getLanguage(locale)] }, () => { this.saveState(); });
            } else {
              this.logger.info('Failed to re-initialized SDK for:', locale);
              this.setState({ error: true, errorMessage: this.state.messages.modal_error_failed_to_reinitialize_sdk });
            }
          })
          .catch(() => {
            this.logger.info('Failed to re-initialized SDK for:', locale);
            this.setState({ error: true, errorMessage: this.state.messages.modal_error_failed_to_reinitialize_sdk });
          });
    } else {
      const direction = this.getLanguageDirection(locale);
      this.setState({ locale, direction, messages: i18n[getLanguage(locale)] }, () => { this.saveState(); });
    }
  }

  sdkInitialized() {
    this.logger.info('sdkInitialized()');
    if (this.state.sdk.initialized) {
      const uniqueLocales = [...new Set(this.state.sdk.getSystemConfiguration().supportedLocales)];
      const supportedLocales = uniqueLocales.filter(n => this.props.supportedLocales.includes(n));
      const localeError = !supportedLocales.includes(this.state.locale);
      if (JSON.stringify(supportedLocales) !== JSON.stringify(this.state.supportedLocales)) {
        if (!localeError) {
          this.logger.info('supportedLocales: ', supportedLocales);
          this.setState({ supportedLocales });
        } else {
          this.logger.info('Unsupported locale: ', this.state.locale);
          this.setState({
            supportedLocales, locale: 'en_US', error: true, errorMessage: this.state.messages.modal_error_unsupported_locale_retry,
          });
          return false;
        }
      } else if (localeError) {
        this.logger.info('Unsupported locale:', this.state.locale);
        this.setState({ locale: 'en_US', error: true, errorMessage: this.state.messages.modal_error_unsupported_locale_retry });
        return false;
      }
    }

    this.saveState();
    return true;
  }

  getNotifications() {
    this.logger.debug('Getting notifications');
    const consumer = this.state.consumer;
    if (consumer) {
      const newState = {};
      this.state.sdk.consumerService.getNotifications(consumer)
          .then((notifications) => {
            newState.hasDependentRequest = notifications.dependentAccessRequestCount > 0;
            newState.hasAppointmentReminder = notifications.appointmentCount > 0 && notifications.isTimeForNextAppointment;
            newState.hasSecureMessage = notifications.totalInboxCount > 0 && notifications.unreadInboxCount > 0;
            this.setState(newState);
          })
          .catch((error) => {
            // not sure I want to fail here...
            this.logger.error('Failed to fetch notifications', error);
          });
    }
  }

  hideSecureMessagesOnBell() {
    this.setState({ hasSecureMessage: false });
  }

  hideAccessRequestOnBell() {
    this.setState({ hasDependentRequest: false });
  }

  hideAppointmentsOnBell() {
    this.setState({ hasAppointmentReminder: false });
  }

  enableNotificationsBox() {
    this.setState({ displayNotifications: true });
  }

  disableNotificationsBox() {
    this.setState({ displayNotifications: false });
  }

  saveState() {
    this.logger.debug('saving session.');
    sessionStorage.setItem('sdk', this.state.sdk.instanceState);
    sessionStorage.setItem('authenticated', this.state.authenticated);
    sessionStorage.setItem('authentication', this.state.authentication);
    sessionStorage.setItem('consumer', this.state.consumer);
    sessionStorage.setItem('activeConsumer', this.state.activeConsumer);
    sessionStorage.setItem('locale', this.state.locale);
    sessionStorage.setItem('logger', this.logger);
    sessionStorage.setItem('direction', this.state.direction);
  }

  clearState() {
    this.logger.debug('clear session for the consumer');
    sessionStorage.removeItem('authenticated');
    sessionStorage.removeItem('authentication');
    sessionStorage.removeItem('consumer');
    sessionStorage.removeItem('activeConsumer');
  }

  processDeepLink(deeplink) {
    // be a bit more defensive regarding the redirects that seem to take place. We only want to set the
    // deep link when it's a legit deeplink
    if(deeplink && deeplink.pathname !== '/') {
      const link = deeplink.state && deeplink.state.from ? deeplink.state.from : deeplink
      this.logger.info('Received a deeplink, saving in session storage: ', link);
      sessionStorage.setItem('deeplink', JSON.stringify(link));
    }
  }

  setCartModeActive(isCartModeActive) {
    this.setState({ isCartModeActive }, () => { sessionStorage.setItem('isCartModeActive', isCartModeActive); });
  }

  showErrorModal(message, header) {
    this.setState({ error: true, errorMessage: message, errorHeader: header });
  }

  setIsSimpleHeader(isSimpleHeader) {
    this.setState({ isSimpleHeader }, () => { sessionStorage.setItem('isSimpleHeader', isSimpleHeader); });
  }

  toggleErrorModal() {
    this.setState(prevState => ({
      error: !prevState.error,
    }), () => {
      if (!this.state.error) {
        const locale = this.determineLocale();
        const direction = this.getLanguageDirection(locale);
        if (locale !== this.state.locale || direction !== this.state.direction) {
          this.logger.info('changing locale to ', this.state.locale);
          this.changeLocale(this.state.locale);
        }
      }
    });
  }

  handleError(error) {
    if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.props.history.push('/sessionExpired');
    } else {
      this.logger.info('Something went wrong:', error);
      this.showErrorModal(error.message);
    }
  }

  render() {
    this.logger.info('sdk initialized=', this.state.sdk.initialized);
    let supportedLocales = this.state.supportedLocales;
    const activeConsumer = this.state.activeConsumer;
    const dependents = this.state.dependents;
    const isDependent = activeConsumer && activeConsumer.isDependent; // is the active consumer a dependent of the consumer
    let genderSupportEnabled = this.state.genderSupportEnabled;
    let supportedGenderIdentities = this.state.genderIdentities;
    if (this.state.sdk.initialized) {
      genderSupportEnabled = this.state.sdk.getSystemConfiguration().genderSupportEnabled;
      supportedGenderIdentities = this.state.sdk.getSystemConfiguration().genderIdentities;
    }
    if (this.state.sdk.initialized && supportedLocales) {
      const sdkSystemConfig = this.state.sdk.getSystemConfiguration();
      if (sdkSystemConfig) {
        supportedLocales = [ ...new Set(sdkSystemConfig.supportedLocales)].filter(n => supportedLocales.includes(n));
      }
      this.logger.info('supportedLocales: ', supportedLocales);
    }

    const messages = this.state.messages;
    const properties = {
      messages,
      sdk: this.state.sdk,
      configuration: window.awsdkconfig,
      sdkVersion: awsdk.AWSDK.version,
      locale: this.state.locale,
      direction: this.state.direction,
      supportedLocales,
      authenticated: this.state.authenticated,
      consumer: this.state.consumer,
      authentication: this.state.authentication,
      mutualAuthEnabled: (localStorage.getItem('mutualAuthEnabled') === 'true'),
      publicUrl: process.env.PUBLIC_URL,
      changeLocaleCallback: this.changeLocale,
      consumerAuthenticationCallback: this.consumerAuthenticationCallback,
      partiallyAuthenticatedCallback: this.partiallyAuthenticatedCallback,
      consumerLogoutCallback: this.consumerLogoutCallback,
      sdkInitialized: this.sdkInitialized,
      consumerUpdated: this.consumerUpdated,
      activateConsumer: this.activateConsumer,
      activeConsumer,
      isDependent,
      logger: this.logger,
      dependents,
      isSimpleHeader: this.state.isSimpleHeader,
      setIsSimpleHeader: this.setIsSimpleHeader,
      isCartModeActive: this.state.isCartModeActive,
      setCartModeActive: this.setCartModeActive,
      updateDependentsCallback: this.updateDependentsCallback,
      hasDependentRequest: this.state.hasDependentRequest,
      hasAppointmentReminder: this.state.hasAppointmentReminder,
      hasSecureMessage: this.state.hasSecureMessage,
      enableNotificationsBox: this.enableNotificationsBox,
      disableNotificationsBox: this.disableNotificationsBox,
      displayNotifications: this.state.displayNotifications,
      getNotifications: this.getNotifications,
      processDeepLink: this.processDeepLink,
      isHeaderMenuDisabled: this.state.isHeaderMenuDisabled,
      updateIsHeaderMenuDisabledCallback: this.updateIsHeaderMenuDisabledCallback,
      hideSecureMessagesOnBell: this.hideSecureMessagesOnBell,
      hideAccessRequestOnBell: this.hideAccessRequestOnBell,
      hideAppointmentsOnBell: this.hideAppointmentsOnBell,
      showErrorModal: this.showErrorModal,
      handleError: this.handleError,
      genderSupportEnabled,
      supportedGenderIdentities
    };

    return (
        <IntlProvider locale={getLanguage(this.state.locale)} messages={messages}>
          <BrowserRouter>
            <RouteInterceptor {...properties}>
              <div className={this.state.direction} dir={this.state.direction} lang={getLanguage(this.state.locale)}>
                <InformationModal
                    className="errorModal"
                    isOpen={this.state.error}
                    toggle={this.toggleErrorModal.bind(this)}
                    message={this.state.errorMessage || this.state.messages.modal_error_something_went_wrong}
                    header={this.state.errorHeader || this.state.messages.modal_error_generic_header}
                    messages={this.state.messages}/>
                <Switch>
                  <PublicRoute path='/welcome' component={Welcome} {...properties} />
                  <PublicRoute path='/setup' component={Setup} {...properties} />
                  <PublicRoute path='/sessionExpired' component={SessionExpired} {...properties} />
                  <InitializedRoute exact path='/passwordAssistance' component={PasswordAssistance} {...properties} />
                  <InitializedRoute path='/passwordAssistance/fail' component={PasswordResetEnded} {...properties} />
                  <InitializedRoute path='/passwordAssistance/complete' component={PasswordResetEnded} {...properties} />
                  <InitializedRoute path='/registration' component={Registration} {...properties} />
                  <InitializedRoute path='/loginAssistance' component={LoginAssistance} {...properties} />
                  <InitializedRoute path='/usernameAssistance' component={UsernameAssistance} {...properties} />
                  <InitializedRoute path='/login' component={Login} {...properties} />
                  <InitializedRoute path='/testMyComputer' component={TestMyComputer} {...properties} />
                  <InitializedRoute exact path='/guest' component={GuestIntake} {...properties} />
                  <InitializedRoute path='/guestWaiting' component={GuestWaitingRoom} {...properties} />
                  <InitializedRoute path='/guestVisit' component={GuestVisitInProgress} {...properties} />
                  <InitializedRoute path='/guestVisitWebRTC' component={GuestVisitWebRTCInProgress} {...properties} />
                  <InitializedRoute path='/guestVisitEnded' component={GuestVisitEnded} {...properties} />
                  <PrivateRoute exact path='/' component={Landing} {...properties} />
                  <PrivateRoute path='/myprofile' component={MyProfileContainer} {...properties} />
                  <PrivateRoute path='/myhealth' component={MyHealthContainer} {...properties} />
                  <PrivateRoute path='/myrecords' component={MyRecordsContainer} {...properties} />
                  <PrivateRoute path='/tracker' component={MyHealthTrackerContainer} {...properties} />
                  <PrivateRoute path='/appointments' component={Appointments} {...properties} />
                  <PrivateRoute path='/appointment/details' component={AppointmentDetails} {...properties} />
                  <PrivateRoute path='/cartmode' component={CartMode} {...properties} />
                  <PrivateRoute path='/mymessages' component={MyMessages} {...properties} />
                  <PrivateRoute path='/services' component={Services} {...properties} />
                  <PrivateRoute path='/providers' component={PastProviders} {...properties} />
                  <PrivateRoute path='/practice' component={Practice} {...properties} />
                  <PrivateRoute path='/visit/firstAvailable' component={FirstAvailable} {...properties} />
                  <PrivateRoute path='/confirmAppointment' component={ConfirmAppointment} {...properties} />
                  <PrivateRoute path='/visit/phone/inProgress' component={VisitPhoneInProgress} {...properties} />
                  <PrivateRoute path='/visit/phone/waitingRoom' component={VisitPhoneWaitingRoom} {...properties} />
                  <PrivateRoute path='/visit/intake' component={VisitIntake} {...properties} />
                  <PrivateRoute path='/visit/cost' component={VisitCost} {...properties} />
                  <PrivateRoute path='/visit/waitingRoom' component={VisitWaitingRoom} {...properties} />
                  <PrivateRoute path='/visit/inProgress' component={VisitInProgress} {...properties} />
                  <PrivateRoute path='/visit/webRTC' component={WebRTCVisitContainer} {...properties} />
                  <PrivateRoute path='/visit/ended' component={VisitEnded} {...properties} />
                  <PrivateRoute path='/visit/summary' component={VisitSummary} {...properties} />
                  <PrivateRoute path='/logout' component={Logout} {...properties} />
                  <Route component={NoMatchComponent} {...properties} />
                </Switch>
                <PublicRoute component={Footer } {...properties} cssClass="awsdk-footer" />
              </div>
            </RouteInterceptor>
          </BrowserRouter>
        </IntlProvider>
    );
  }
}

class RouteInterceptor extends React.Component {
  componentDidUpdate() {
    if (this.props.isCartModeActive &&
        !['/cartmode/patient',
          '/cartmode/topics',
          '/visit/cost',
          '/visit/waitingRoom',
          '/visit/firstAvailable',
          '/visit/inProgress'].includes(window.location.pathname)) {
      this.props.setCartModeActive(false);
    }
  }

  render() {
    return (
        <div>
          {this.props.children}
        </div>
    );
  }
}

App.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  supportedLocales: PropTypes.array,
};

App.defaultProps = {
  supportedLocales: ['en_US', 'hi_IN', 'iw_IL', 'zh_CN', 'pt_PT'],
};

export default withRouter(App);
