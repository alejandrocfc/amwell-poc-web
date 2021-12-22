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

import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import awsdk from 'awsdk';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FormattedMessage, FormattedHTMLMessage, FormattedNumber } from 'react-intl';
import StarRatingComponent from 'react-star-rating-component';
import YellowStar from '../visit/images/yellow-star.png';
import GrayStar from '../visit/images/gray-star.png';
import { HeaderWithBar, PrescriptionsAndPharmacy, DiagnosesAndProcedures, FollowUpList } from './VisitSummaryComponents';

import './VisitSummaryComponent.css';
import './VisitSummaryComponents.css';
import VisitShareSummaryComponent from './VisitShareSummaryComponent';

class VisitSummaryComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.info('VisitSummaryComponent: props', props);
    this.sysConfig = props.sdk.getSystemConfiguration();
    this.maxRTLLocalRatingIndex = 6;
    this.state = {
      formError: false,
      feedbackAnswer: null,
      feedbackAnswerError: false,
      providerRatingError: false,
      overallVisitRatingError: false,
      providerRating: 0,
      overallRating: 0,
    };
  }

  onStarClick(nextValue, prevValue, name) {
    this.props.logger.debug('Found nextValue: {0}, prevValue: {1}, name: {2}', nextValue, prevValue, name);
    const state = {};
    if (name === 'providerRating') {
      state.providerRating = (this.props.direction === 'rtl') ? (this.maxRTLLocalRatingIndex - nextValue) : nextValue;
      state.providerRatingError = false;
    } else if (name === 'overallRating') {
      state.overallRating = (this.props.direction === 'rtl') ? (this.maxRTLLocalRatingIndex - nextValue) : nextValue;
      state.overallVisitRatingError = false;
    }
    this.setState(state);
  }

  handleChange(e) {
    if (e.target.value !== this.props.messages.input_select_text) {
      this.setState({ feedbackAnswer: e.target.value, feedbackAnswerError: false });
    }
  }

  getLocaleStarIcon(imgId, index, selectedIndex) {
    if (selectedIndex === 0) {
      return <img id={imgId} alt='star' src={ GrayStar } />;
    }
    const localeIndex = (this.props.direction === 'rtl') ? (this.maxRTLLocalRatingIndex - index) : index;
    return <img id={imgId} alt='star' src={ localeIndex > selectedIndex ? GrayStar : YellowStar } />;
  }

  submit(e) {
    e.preventDefault();
    const state = {};
    const feedbackQuestion = this.props.visitSummary.consumerFeedbackQuestion;
    const feedbackAnswer = this.state.feedbackAnswer;
    const providerRating = this.state.providerRating;
    const overallRating = this.state.overallRating;
    if (this.sysConfig && this.sysConfig.showProviderRating) {
      if (this.state.providerRating === 0) {
        state.formError = true;
        state.providerRatingError = true;
      }
    }
    if (this.sysConfig && !this.sysConfig.endVisitRatingsOptional) {
      if (this.state.overallRating === 0) {
        state.formError = true;
        state.overallVisitRatingError = true;
      }
    }

    // no answer is provided + we're showing the question + it's not a phone only-visit
    if (!feedbackAnswer &&
      feedbackQuestion.show &&
      this.props.visitSummary.modality.modalityType !== awsdk.AWSDKVisitModalityType.PHONE) {
      state.feedbackAnswerError = true;
      state.formError = true;
    }

    if (!state.formError) {
      const formFields = {};
      formFields.feedbackAnswer = feedbackAnswer;
      formFields.feedbackQuestion = feedbackQuestion.questionText;
      formFields.providerRating = providerRating;
      formFields.overallRating = overallRating;
      formFields.visitSummary = this.props.visitSummary;
      this.props.visitDone(formFields);
    } else {
      this.setState(state);
    }
  }

  render() {
    const visitCost = this.props.visitSummary.visitCost;
    const noCost = visitCost.zeroCostVisit;
    const cost = <FormattedNumber value={visitCost.expectedConsumerCopayCost}
      // eslint-disable-next-line
      style='currency'
      currency={this.props.currency}
      minimumFractionDigits={2}
      maximumFractionDigits={2}
    />;
    const isPhoneVisit = this.props.visitSummary.modality.modalityType === awsdk.AWSDKVisitModalityType.PHONE;
    const feedbackQuestion = this.props.visitSummary.consumerFeedbackQuestion;
    const showFeedbackQuestion = feedbackQuestion && !isPhoneVisit ? feedbackQuestion.show : false;
    const feedbackQuestionText = feedbackQuestion ? feedbackQuestion.questionText : '';
    const responseOptions = feedbackQuestion ? feedbackQuestion.responseOptions.slice() : [];
    const provEntries = this.props.visitSummary.providerEntries;
    const provNotes = provEntries ? provEntries.notes : null;
    const hasDiagnosesOrProcedures = (provEntries && ((provEntries.diagnoses && provEntries.diagnoses.length > 0) || (provEntries.procedures && provEntries.procedures.length > 0)));
    const isDeferredBilling = (visitCost && visitCost.deferredBillingInEffect);
    const isSuppressChargeTimeout = (this.props.activeConsumer.subscription &&
      this.props.activeConsumer.subscription.healthPlan.payerInfo.isSuppressCharge &&
      visitCost && !noCost &&
      visitCost.eligibilityRequestError === 'CONNECTION_TIMEOUT' &&
      visitCost.costCalculationStatus === 'FINISHED');
    const summaryTitle = isPhoneVisit ? this.props.messages.visit_summary_concludes_phone : this.props.messages.visit_summary_concludes;

    responseOptions.unshift(this.props.messages.input_select_text);
    return (
      <div className="visitForm">
        <div className="visitSummary">
          <div className="visitSummaryProvider">
            <FormattedHTMLMessage id="visitSummaryProvider"
              defaultMessage={ summaryTitle }
              values={{ doctor: this.props.visitSummary.assignedProvider.fullName, specialty: this.props.visitSummary.assignedProvider.specialty.value }}/>
            {isSuppressChargeTimeout && <div className="visitCostMessage">{this.props.messages.visit_cost_payment_suppressed_resolution}</div>}
          </div>
          <div className="visitSummarySeparator"><hr /></div>
          {isDeferredBilling && visitCost.deferredBillingText &&
            <div id="deferredBillingMessages" className="visitCostMessage">
              <FormattedHTMLMessage id="deferredBillingText" defaultMessage={ visitCost.deferredBillingText }/>
            </div>
          }
          {!noCost && !isDeferredBilling &&
            <div className="visitSummaryBilling">
              {isSuppressChargeTimeout && !visitCost.totalCostWaived &&
                <div className="visitSummaryCostMessage">
                  <FormattedMessage id="visitSummaryBilling"
                    defaultMessage={ this.props.messages.visit_cost_payment_suppressed_max } values={{ cost: <span className="visitSummaryBillingCost">{cost}</span> }}/>
                </div>
              }
              {!isSuppressChargeTimeout &&
                <div>
                  <div className="visitSummaryCostMessage">
                    <FormattedMessage id="visitSummaryBilling"
                      defaultMessage={ this.props.messages.visit_summary_cost_message } values={{ cost: <span className="visitSummaryBillingCost">{cost}</span> }}/>
                  </div>
                  {!noCost && <div className="visitSummaryCreditCardNumber"><b>{this.props.paymentMethod.lastDigits}</b></div>}
                  <div className="visitSummaryBillingMessage">{ this.props.messages.visit_summary_billing_message }</div>
                </div>
              }
            </div>
          }
          {provNotes &&
            <div className="visitSummaryNotes">
              <HeaderWithBar header={this.props.messages.visit_summary_notes}/>
              <div className="visitSummaryNotesText">
                <IFrame notes={provNotes} />
              </div>
            </div>}

          {provEntries.agendaItemFollowUps && provEntries.agendaItemFollowUps.length > 0 &&
            <div className="visitSummaryFollowUpItems">
              <FollowUpList messages={this.props.messages} title={this.props.messages.visit_summary_followup} followUpItems={provEntries.agendaItemFollowUps}/>
            </div>}

          {provEntries.postVisitFollowUpItems && provEntries.postVisitFollowUpItems.length > 0 &&
            <div className="visitSummaryPostVisitItems">
              <FollowUpList messages={this.props.messages} title={this.props.messages.visit_summary_post_visit_title} followUpItems={provEntries.postVisitFollowUpItems}/>
            </div>}

          {provEntries.prescriptions && provEntries.prescriptions.length > 0 &&
            <div className="visitSummaryPrescriptions">
              <PrescriptionsAndPharmacy messages={this.props.messages} pharmacy={this.props.visitSummary.pharmacy} prescriptions={provEntries.prescriptions}/>
            </div>}

          {hasDiagnosesOrProcedures &&
            <div className="visitSummaryDiagnosis">
              <DiagnosesAndProcedures messages={this.props.messages} diagnoses={provEntries.diagnoses} procedures={provEntries.procedures}/>
            </div>}

          <Form id="visitSummaryForm">
            {(this.props.showSendVisitSummary || this.props.electronicFaxEnabled) && <VisitShareSummaryComponent {...this.props}/>}
            <FormGroup>
              <div className="visitSummaryRatings" id="visitSummaryRatings">
                { this.sysConfig.showProviderRating &&
                  <div className='visitSummaryRateProvider' id="visitSummaryRateProvider">
                    <div className="visitSummaryRatingTitle" id="visitSummaryRateProviderTitle">{this.props.messages.visit_summary_rate_this_provider}</div>
                    <StarRatingComponent
                      name="providerRating"
                      starCount={5}
                      value={this.state.providerRating}
                      onStarClick={this.onStarClick.bind(this)}
                      renderStarIcon={(currentIndex, selectedIndex) => this.getLocaleStarIcon('providerRatingStar', currentIndex, selectedIndex)} />
                    <div className={ this.state.providerRatingError ? 'error' : 'hidden' } id="providerRatingError">
                      <span>{this.props.messages.visit_summary_provider_ratings_error}</span>
                    </div>
                  </div>
                }
                { this.sysConfig.showProviderRating && <div className="visitSummaryRatingsDivider" /> }
                <div className="visitSummaryRateOverallVisit" id="visitSummaryRateOverallVisit">
                  <div className="visitSummaryRatingTitle" id="visitSummaryRateOverallVisitTitle">{this.props.messages.visit_summary_rate_your_overall_experience}</div>
                  <StarRatingComponent
                    name="overallRating"
                    starCount={5}
                    value={this.state.overallRating}
                    onStarClick={this.onStarClick.bind(this)}
                    renderStarIcon={(currentIndex, selectedIndex) => this.getLocaleStarIcon('overallRatingStar', currentIndex, selectedIndex)} />
                  <div className={this.state.overallVisitRatingError ? 'error' : 'hidden' } id="overallVisitRatingError">
                    <span>{this.props.messages.visit_summary_overall_visit_rating_error}</span>
                  </div>
                </div>
              </div>
            </FormGroup>
            {showFeedbackQuestion &&
            <FormGroup>
              <div className="visitSummaryFeedbackQuestion" id="visitSummaryFeedbackQuestion">
                <Label for="feedbackAnswer" className="visitSummaryFeedbackQuestionText">{feedbackQuestionText}</Label>
                <Input type="select" name="feedbackAnswer" id="visitSummaryFeedbackAnswer" onChange={e => this.handleChange(e)}>
                  {responseOptions.map((option, indx) => <option key={indx}>{option}</option>)}
                </Input>
                <div className={this.state.feedbackAnswerError ? 'visitSummaryFeedbackAnswerError error' : 'hidden'} id="visitSummaryFeedbackAnswerError">
                  <span>{this.props.messages.visit_summary_feedbackAnswer_error}</span>
                </div>
              </div>
            </FormGroup>}
          </Form>
          <div id="visitSummarySubmit" className="visitSubmit">
            <Button id="submit" className='visitButton' onClick={e => this.submit(e)}>{this.props.messages.visit_done}</Button>
          </div>
        </div>
      </div>
    );
  }
}

VisitSummaryComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  visitSummary: PropTypes.object.isRequired,
  visitDone: PropTypes.func.isRequired,
};
VisitSummaryComponent.defaultProps = {};

const IFrame = ({ notes, ...props }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if(contentRef) {
      contentRef.current.contentWindow.document.body.innerHTML = notes;
    }
  })

  return (
    <iframe title='VisitSummaryNotesBody' id='visitSummaryNotesBody' className='visitSummaryNotesBody' src='about:blank' {...props} ref={contentRef} />
  )
}
export default VisitSummaryComponent;
