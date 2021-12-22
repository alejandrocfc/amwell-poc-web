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

import awsdk from 'awsdk';
import ValueLinkedContainer from './ValueLinkedContainer';
import MyProfileInsuranceComponent from '../components/myprofile/insurance/MyProfileInsuranceComponent';
import { isValidDate } from '../components/Util';

class MyProfileInsuranceContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    props.logger.info('MyProfileInsuranceContainer: props', props);
    this.state = this.getInitialState();
  }

  componentDidMount() {
    this.props.enableSpinner();
    const getCountries = this.props.sdk.getCountries();
    const getHealthPlans = this.props.sdk.getHealthPlans();
    const getRelationships = this.props.sdk.getRelationshipsToSubscriber().then((result) => {
      const filtered = result.filter(rel => rel.displayName !== 'SUBSCRIBER');
      this.selfSubscriberRelationship = result.find(rel => rel.displayName === 'SUBSCRIBER');
      return filtered;
    });

    Promise.all([getCountries, getHealthPlans, getRelationships]).then((results) => {
      const countries = results[0];
      const healthPlans = results[1].filter(hp => hp.feedControlled !== true);
      const relationshipsToSubscriber = results[2];
      this.setState({ countries, healthPlans, relationshipsToSubscriber });
    }).catch((error) => {
      if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
        this.props.history.push('/sessionExpired');
      } else {
        this.props.logger.info('Something went wrong:', error);
        this.props.showErrorModal();
      }
    }).finally(() => this.props.disableSpinner());
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.healthPlanPersistentId !== this.state.healthPlanPersistentId && !this.state.identifiesAsPrimary) {
      this.setState({ identifiesAsPrimary: true });
    }
  }

  setSelectedOption(selected) {
    this.setState({ selectedOption: selected });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.selectedOption === 'hasInsurance') {
      this.updateInsurance();
    } else {
      this.removeInsurance();
    }
  }

  removeInsurance() {
    this.props.enableSpinner();
    this.props.sdk.consumerService.removeInsuranceSubscription(this.props.activeConsumer)
      .then(() => this.props.sdk.consumerService.getUpdatedConsumer(this.props.activeConsumer))
      .then((consumer) => {
        this.setState({ editInsurance: false, eligibilityError: false });
        this.props.consumerUpdated(consumer);
      })
      .catch((error) => {
        this.props.logger.error(error);
        this.mapErrors([error]);
      })
      .finally(() => {
        this.props.disableSpinner();
      });
  }

  findHealthPlanByPersistentId(id) {
    if (!this.state.healthPlans || !this.state.healthPlanPersistentId) {
      return null;
    }
    return this.state.healthPlans.find(plan => plan.id.persistentId === id);
  }

  getDateOfBirth() {
    const dob = this.state.primarySubscriberDob;
    if (dob && dob.month && dob.year && dob.day) {
      return new Date(Date.UTC(dob.year, dob.month - 1, dob.day));
    }
    return null;
  }

  updateInsurance(ignoreEligibility = false) {
    const healthPlanUpdate = this.props.sdk.consumerService.newSubscriptionUpdate();
    healthPlanUpdate.ignoreEligibilityChecks = ignoreEligibility;
    healthPlanUpdate.healthPlan = this.findHealthPlanByPersistentId(this.state.healthPlanPersistentId);
    healthPlanUpdate.subscriberId = this.state.subscriberId;
    healthPlanUpdate.subscriberSuffix = this.state.subscriberSuffix;
    const selectedRelationship = this.state.relationshipsToSubscriber.find(rel => rel.displayName === this.state.relationshipToSubscriberDisplayName);
    healthPlanUpdate.relationshipToSubscriberCode = this.state.identifiesAsPrimary ? this.selfSubscriberRelationship : selectedRelationship;
    if (!this.state.identifiesAsPrimary) {
      healthPlanUpdate.primarySubscriberFirstName = this.state.primarySubscriberFirstName;
      healthPlanUpdate.primarySubscriberLastName = this.state.primarySubscriberLastName;
      const dob = this.getDateOfBirth();
      if (dob) {
        healthPlanUpdate.primarySubscriberDateOfBirth = this.getDateOfBirth();
      }
    }
    const errors = this.props.sdk.consumerService.validateSubscriptionUpdate(healthPlanUpdate, this.props.activeConsumer);
    this.mapErrors(errors);
    if (errors.length === 0) {
      this.props.enableSpinner();
      this.props.sdk.consumerService.updateInsuranceSubscription(this.props.activeConsumer, healthPlanUpdate)
        .then(() => this.props.sdk.consumerService.getUpdatedConsumer(this.props.activeConsumer))
        .then((consumer) => {
          this.setState({ editInsurance: false, eligibilityError: false });
          this.props.consumerUpdated(consumer);
        })
        .catch((error) => {
          this.props.logger.error(error);
          this.mapErrors([error]);
        })
        .finally(() => {
          this.props.disableSpinner();
        });
    }
  }

  mapErrors(errors) {
    const formErrors = [];
    errors.forEach((error) => {
      if (error.reason === 'field required') {
        if (error.fieldName === 'relationshipToSubscriberCode') {
          formErrors.relationshipToSubscriberDisplayName = this.props.messages.my_profile_insurance_relationship_required;
        } else if (error.fieldName === 'subscriberSuffix') {
          formErrors.subscriberSuffix = this.props.messages.my_profile_insurance_subscriber_suffix_required;
        } else if (error.fieldName === 'subscriberId') {
          formErrors.subscriberId = this.props.messages.my_profile_insurance_subscriber_id_required;
        } else if (error.fieldName === 'primarySubscriberFirstName') {
          formErrors.primarySubscriberFirstName = this.props.messages.validation_first_name_required;
        } else if (error.fieldName === 'primarySubscriberLastName') {
          formErrors.primarySubscriberLastName = this.props.messages.validation_last_name_required;
        } else if (error.fieldName === 'primarySubscriberDateOfBirth') {
          formErrors.primarySubscriberDob = this.props.messages.my_profile_insurance_primary_subscriber_dob_required;
        } else if (error.fieldName === 'healthPlan') {
          formErrors.healthPlanPersistentId = this.props.messages.my_profile_insurance_health_plan_required;
        }
      } else if (error.reason === 'invalid value') {
        if (error.fieldName === 'relationshipToSubscriberCode') {
          formErrors.relationshipToSubscriberCodeName = this.props.messages.my_profile_insurance_relationship_required;
        } else if (error.fieldName === 'primarySubscriberDateOfBirth') {
          formErrors.primarySubscriberDob = this.props.messages.validation_dob_invalid;
        } else if (error.fieldName === 'primarySubscriberFirstName') {
          formErrors.primarySubscriberFirstName = this.props.messages.validation_first_name_invalid;
        } else if (error.fieldName === 'primarySubscriberLastName') {
          formErrors.primarySubscriberLastName = this.props.messages.validation_last_name_invalid;
        } else if (error.fieldName === 'subscriberId') {
          formErrors.subscriberId = this.props.messages.my_profile_insurance_subscriber_id_invalid;
        }
      } else if (error.errorCode === awsdk.AWSDKErrorCode.eligibilityCheckError) {
        this.setState({ eligibilityError: true, eligibilityErrorMsg: this.props.messages.my_profile_insurance_eligibility_error });
      } else if (error.errorCode === awsdk.AWSDKErrorCode.healthPlanSubscriptionEnrollmentError) {
        this.props.showErrorModal(error.message, this.props.messages.my_profile_insurance_health_plan_enrollment_error);
      } else if (error.errorCode === awsdk.AWSDKErrorCode.invalidParameter) {
        this.props.showErrorModal(error.message, this.props.messages.my_profile_insurance_health_plan_enrollment_error);
      } else if (error.errorCode === awsdk.AWSDKErrorCode.pollingTimeout) {
        this.setState({ eligibilityError: true, eligibilityErrorMsg: this.props.messages.my_profile_insurance_eligibility_error });
      } else if (error.errorCode === awsdk.AWSDKErrorCode.inaccurateSubscriberInfo) {
        this.setState({ eligibilityError: true, eligibilityErrorMsg: this.props.messages.my_profile_insurance_subscriber_info_inaccurate });
      } else if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
        this.props.history.push('/sessionExpired');
      } else {
        this.props.showErrorModal(null, this.props.messages.my_profile_insurance_health_plan_enrollment_error);
      }
    });
    this.setState({ errors: formErrors });
  }

  isValidSubscriberId(subscriberId, healthPlan) {
    if (!subscriberId || !healthPlan) {
      return false;
    }
    return !healthPlan.payerInfo || !healthPlan.payerInfo.subscriberIdPattern || subscriberId.match(healthPlan.payerInfo.subscriberIdPattern);
  }

  isValidSuffix(suffix) {
    const selectedHealthPlan = this.findHealthPlanByPersistentId(this.state.healthPlanPersistentId);
    if (selectedHealthPlan && selectedHealthPlan.usesSuffix) {
      return suffix;
    }
    return true;
  }

  setIdentifiesAsPrimary(isPrimary) {
    this.setState({ identifiesAsPrimary: isPrimary });
  }

  toggleEditInsurance(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState(prevState => (this.getInitialState(prevState)));
  }

  getInitialState(prevState) {
    const currentSubscription = this.props.activeConsumer.subscription;
    const primaryDob = (currentSubscription && currentSubscription.primarySubscriberDateOfBirth) || null;
    const relationshipName = (currentSubscription && currentSubscription.relationshipToSubscriberCode.displayName) || '';
    return {
      errors: [],
      modified: [],
      countries: prevState ? prevState.countries : [],
      relationshipsToSubscriber: prevState ? prevState.relationshipsToSubscriber : [],
      healthPlans: prevState ? prevState.healthPlans : [],
      editInsurance: prevState ? !prevState.editInsurance : false,
      eligibilityError: false,
      isMemberFeedControlled: this.props.activeConsumer.memberType === 'HP' || (currentSubscription && currentSubscription.healthPlan.feedControlled),
      selectedOption: currentSubscription ? 'hasInsurance' : 'noInsurance',
      healthPlanPersistentId: currentSubscription ? currentSubscription.healthPlan.id.persistentId : '',
      subscriberId: currentSubscription ? currentSubscription.subscriberId : '',
      subscriberSuffix: currentSubscription ? currentSubscription.subscriberSuffix : '',
      relationshipToSubscriberDisplayName: relationshipName && relationshipName !== 'SUBSCRIBER' ? relationshipName : '',
      identifiesAsPrimary: currentSubscription ? currentSubscription.relationshipToSubscriberCode.displayName === 'SUBSCRIBER' : true,
      primarySubscriberFirstName: currentSubscription && currentSubscription.primarySubscriberFirstName ? currentSubscription.primarySubscriberFirstName : '',
      primarySubscriberLastName: currentSubscription && currentSubscription.primarySubscriberLastName ? currentSubscription.primarySubscriberLastName : '',
      primarySubscriberDob: {
        year: primaryDob ? primaryDob.getUTCFullYear() : '',
        month: primaryDob ? primaryDob.getUTCMonth() + 1 : '',
        day: primaryDob ? primaryDob.getUTCDate() : '',
      },
    };
  }

  toggleEligibilityPrompt(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState(prevState => ({
      eligibilityError: !prevState.eligibilityError,
    }));
  }

  render() {
    const { isMultiCountry } = this.props.sdk.getSystemConfiguration().isMultiCountry;
    const primarySubscriberDob = this.props.activeConsumer.subscription ? this.props.activeConsumer.subscription.primarySubscriberDateOfBirth : null;
    const selectedHealthPlan = this.findHealthPlanByPersistentId(this.state.healthPlanPersistentId);
    const properties = {
      countries: this.state.countries,
      isMultiCountry,
      isMemberFeedControlled: this.state.isMemberFeedControlled,
      selectedOption: this.state.selectedOption,
      setSelectedOption: this.setSelectedOption.bind(this),
      eligibilityError: this.state.eligibilityError,
      eligibilityErrorMsg: this.state.eligibilityErrorMsg,
      identifiesAsPrimary: this.state.identifiesAsPrimary,
      setIdentifiesAsPrimary: this.setIdentifiesAsPrimary.bind(this),
      isPrimary: this.props.activeConsumer.subscription && this.props.activeConsumer.subscription.relationshipToSubscriberCode.displayName === 'SUBSCRIBER',
      healthPlans: this.state.healthPlans,
      relationshipsToSubscriber: this.state.relationshipsToSubscriber,
      isEditInsurance: this.state.editInsurance,
      toggleEditInsurance: this.toggleEditInsurance.bind(this),
      toggleEligibilityPrompt: this.toggleEligibilityPrompt.bind(this),
      updateInsurance: this.updateInsurance.bind(this),
      subscription: this.props.activeConsumer.subscription,
      currentConsumer: this.props.activeConsumer,
      dobForDisplay: primarySubscriberDob,
    };
    const patternErrorMsg = selectedHealthPlan && selectedHealthPlan.payerInfo ? selectedHealthPlan.payerInfo.subscriberIdPatternErrorMessage : null;
    const links = this.linkAll();
    links.subscriberId.check(x => !this.state.modified.subscriberId || x, this.props.messages.my_profile_insurance_subscriber_id_required)
      .check(x => !selectedHealthPlan || !this.state.modified.subscriberId || this.isValidSubscriberId(x, selectedHealthPlan), patternErrorMsg || this.props.messages.my_profile_insurance_subscriber_id_invalid);
    links.subscriberSuffix.check(x => !this.state.modified.subscriberSuffix || this.isValidSuffix(x), this.props.messages.my_profile_insurance_subscriber_suffix_required);
    links.primarySubscriberFirstName.check(x => !this.state.modified.primarySubscriberFirstName || this.state.identifiesAsPrimary || x, this.props.messages.validation_first_name_required);
    links.primarySubscriberLastName.check(x => !this.state.modified.primarySubscriberLastName || this.state.identifiesAsPrimary || x, this.props.messages.validation_last_name_required);
    links.primarySubscriberDob.check(x => !this.state.modified.primarySubscriberDob || this.state.identifiesAsPrimary || x.day || x.month > 0 || x.year, this.props.messages.validation_dob_required)
      .check(x => !this.state.modified.primarySubscriberDob || isValidDate(x, false, false), this.props.messages.validation_dob_invalid);
    return (
      <MyProfileInsuranceComponent key="myProfileInsuranceComponent" handleSubmit={this.handleSubmit.bind(this)} valueLinks={links} {...this.props} {...properties} />
    );
  }
}

MyProfileInsuranceContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyProfileInsuranceContainer.defaultProps = {};
export default MyProfileInsuranceContainer;
