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

import VisitHeader from '../components/visit/VisitHeaderComponent';
import VisitSummary from '../components/visitSummary/VisitSummaryComponent';
import SummaryRecipient from '../components/visitSummary/SummaryRecipient';
import { isUnsetOrEmptyString, isUnsetOrEmptyArray } from '../components/Util';

class VisitSummaryContainer extends React.Component {
  constructor(props) {
    super(props);
    this.visitDone = this.visitDone.bind(this);
    this.state = {
      visit: this.props.location.state ? awsdk.AWSDKFactory.restoreVisit(this.props.location.state.visit) : null,
      visitSummary: null,
      paymentMethod: null,
      emailAddresses: [new SummaryRecipient(this.props.activeConsumer.email)],
      faxNumbers: [],
      hipaaAccepted: false,
      showHipaaError: false,
      summarySent: false,
      ratingsSent: false,
      feedbackSent: false,
    };
  }

  componentDidMount() {
    this.props.enableSpinner();
    const paymentMethodPromise = this.props.sdk.consumerService.getPaymentMethod(this.props.activeConsumer)
      .catch((error) => {
        if (error.errorCode === awsdk.AWSDKErrorCode.noPaymentInformationFound) {
          // do nothing
          return Promise.resolve();
        }
        return Promise.reject(error);
      });
    const visitSummaryPromise = this.props.sdk.visitService.getVisitSummary(this.state.visit);

    Promise.all([visitSummaryPromise, paymentMethodPromise])
      .then((values) => {
        this.setState(prevState => ({
          visitSummary: values[0],
          // Add existing email addresses, any guest emails
          emailAddresses: [...prevState.emailAddresses, ...(values[0].inviteEmails || []).map(guest => new SummaryRecipient(guest))],
          paymentMethod: values[1],
        }));
      })
      .catch(error => this.handleError(error))
      .finally(() => this.props.disableSpinner());
  }

  setEmailAddresses(emailAddresses) {
    this.setState({ emailAddresses });
  }

  setFaxNumbers(faxNumbers) {
    this.setState({ faxNumbers });
  }

  setHipaaAccepted(hipaaAccepted) {
    this.setState({ hipaaAccepted, showHipaaError: false });
  }

  getSelectedRecipients(recipientsContactInfo) {
    if (isUnsetOrEmptyArray(recipientsContactInfo)) {
      return recipientsContactInfo;
    }
    return recipientsContactInfo.filter(contactInfo => contactInfo.isSelected && !isUnsetOrEmptyString(contactInfo.value)).map(contactInfo => contactInfo.value);
  }

  visitDone(formFields) {
    this.props.logger.debug('Visit done. Received formFields: ', formFields);
    // pull out provided email and fax numbers
    let recipientsEmailAddresses;
    let recipientsFaxNumbers;
    let hasEmailAddressOrFaxNumber;
    if (this.props.sdk.getSystemConfiguration().showOptionToSendVisitSummary || this.props.sdk.getSystemConfiguration().electronicFaxEnabled) {
      recipientsEmailAddresses = this.getSelectedRecipients(this.state.emailAddresses);
      recipientsFaxNumbers = this.getSelectedRecipients(this.state.faxNumbers);
      hasEmailAddressOrFaxNumber = (!isUnsetOrEmptyArray(recipientsEmailAddresses) || !isUnsetOrEmptyArray(recipientsFaxNumbers));

      if (hasEmailAddressOrFaxNumber && !this.state.hipaaAccepted) {
        this.setState({ showHipaaError: true });
        return;
      }
    }

    // Try to send everything off
    this.props.enableSpinner();

    let feedbackPromise = Promise.resolve();
    if (!this.state.feedbackSent && formFields.feedbackAnswer) {
      feedbackPromise = this.props.sdk.visitService.addFeedback(formFields.visitSummary, formFields.feedbackQuestion, formFields.feedbackAnswer)
        .then(() => {
          this.props.logger.info('Sent FeedbackAnswer');
          this.setState({ feedbackSent: true });
        });
    }

    let ratingPromise = Promise.resolve();
    if (!this.state.ratingsSent) {
      ratingPromise = this.props.sdk.visitService.addRating(formFields.visitSummary, formFields.providerRating, formFields.overallRating)
        .then(() => {
          this.props.logger.info('Sent provider and visit rating');
          this.setState({ ratingsSent: true });
        });
    }

    let summaryPromise = Promise.resolve();
    if (hasEmailAddressOrFaxNumber && !this.state.summarySent) {
      summaryPromise = this.props.sdk.visitService.sendVisitSummary(formFields.visitSummary, this.state.hipaaAccepted, recipientsEmailAddresses, recipientsFaxNumbers)
        .then((visitSummary) => {
          this.props.logger.info('Sent visit summary by email and fax', visitSummary);
          this.setState({ summarySent: true });
        });
    }

    Promise.all([feedbackPromise, ratingPromise, summaryPromise])
      .then(() => this.props.history.push('/'))
      .catch(error => this.handleError(error))
      .finally(() => this.props.disableSpinner());
  }

  handleError(error) {
    if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.props.history.push('/sessionExpired');
    } else if (error.errorCode === awsdk.AWSDKErrorCode.validationErrors) {
      const newState = {};
      const errorStrings = error.errors.map(e => e.fieldValue);
      // check if any email addresses came back as invalid
      if (this.state.emailAddresses) {
        newState.emailAddresses = [...this.state.emailAddresses];
        newState.emailAddresses.forEach((email) => {
          email.hasError = errorStrings.includes(email.value);
        });
      }
      // check if any fax numbers came back as invalid
      if (this.state.faxNumbers) {
        newState.faxNumbers = [...this.state.faxNumbers];
        newState.faxNumbers.forEach((fax) => {
          fax.hasError = errorStrings.includes(fax.value);
        });
      }
      this.setState(newState);
    } else if (error.errorCode === awsdk.AWSDKErrorCode.visitSummaryNotSentError) {
      this.props.showErrorModal(this.props.messages.visit_summary_not_sent_error);
    } else if (error.errorCode === awsdk.AWSDKErrorCode.ratingNotSubmittedError) {
      this.props.showErrorModal(this.props.messages.visit_summary_feedback_not_submitted_error);
    } else if (error.errorCode === awsdk.AWSDKErrorCode.feedbackNotSubmittedError) {
      this.props.showErrorModal(this.props.messages.visit_summary_feedback_not_submitted_error);
    } else {
      this.props.logger.info('Something went wrong:', error);
      this.props.showErrorModal();
    }
  }

  render() {
    const properties = {
      visitSummary: this.state.visitSummary,
      paymentMethod: this.state.paymentMethod,
      emailAddresses: this.state.emailAddresses,
      faxNumbers: this.state.faxNumbers,
      showHipaaModal: this.state.showHipaaModal,
      showHipaaError: this.state.showHipaaError,
      hipaaAccepted: this.state.hipaaAccepted,
      setHipaaAccepted: this.setHipaaAccepted.bind(this),
      setEmailAddresses: this.setEmailAddresses.bind(this),
      setFaxNumbers: this.setFaxNumbers.bind(this),
      visitDone: this.visitDone,
      currency: this.props.sdk.getSystemConfiguration().currencyCode,
      showSendVisitSummary: this.props.sdk.getSystemConfiguration().showOptionToSendVisitSummary,
      electronicFaxEnabled: this.props.sdk.getSystemConfiguration().electronicFaxEnabled,
      notes: this.state.notes,
    };

    return (
      <div>
        {this.state.visitSummary &&
          <VisitHeader id="visitSummary" icon='wrapup' title={this.props.messages.visit_summary}>
            <VisitSummary key="visitSummary" {...this.props} {...properties} />
          </VisitHeader>
        }
      </div>);
  }
}

VisitSummaryContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
VisitSummaryContainer.defaultProps = {};
export default VisitSummaryContainer;
