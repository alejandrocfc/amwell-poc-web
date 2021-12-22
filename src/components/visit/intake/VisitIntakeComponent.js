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
import { FormattedMessage } from 'react-intl';
import awsdk from 'awsdk';

import { Checkbox, PhoneNumberInput, Select } from '../../form/Inputs';
import TriageQuestions from '../../form/TriageQuestionsComponent';
import VisitTopics from '../../form/VisitTopicsComponent';
import InviteGuestComponent from '../InviteGuestComponent';
import DeviceIntegrationComponent from '../tytoDevice/DeviceIntegrationComponent';
import SpeedPassModal from './SpeedPassModal';
import InformationModal from '../../popups/info/InformationModal';
import VisitIntakeModalityPicker from './VisitIntakeModalityPicker';

import './VisitIntakeComponent.css';

class VisitIntakeComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.info('VisitIntakeComponent: props', props);
    this.toggleDisclaimersModal = this.toggleDisclaimersModal.bind(this);
    this.state = {
      isDisclaimersModalOpen: false,
    };
  }

  toggleDisclaimersModal(e) {
    if (e) e.preventDefault();
    this.setState(prevState => ({
      isDisclaimersModalOpen: !prevState.isDisclaimersModalOpen,
    }));
  }

  render() {

    let disclaimers = [];
    if (Array.isArray(this.props.visitContext.disclaimers) && this.props.visitContext.disclaimers.length > 0) {
      disclaimers = this.props.visitContext.disclaimers.filter(item => item.required)
        .map((disclaimer, index) => <div key={index}><h3>{disclaimer.title}</h3><div className="visitIntakeDisclaimerBodyText" dangerouslySetInnerHTML={{ __html: disclaimer.legalText }} /></div>);
    }
    const feedbackQuestion = this.props.visitContext.consumerFeedbackQuestion;

    return (
      <div className="visitForm">
        <div className="visitBodyIntro">{this.props.messages.visit_intake_lets_get_ready}</div>
        <SpeedPassModal {...this.props} />
        <Form className="visitIntakeForm">

          {(this.props.visitContext.topics || this.props.visitContext.triageQuestions) &&
            <div className="visitIntakeSection visitIntakeTopicsAndTriage">
              <div>{this.props.messages.visit_intake_topics}</div>
              <VisitTopics topics={this.props.visitContext.topics} {...this.props} />
              <TriageQuestions triageQuestions={this.props.visitContext.triageQuestions} {...this.props} />
            </div>}

          <div className="visitIntakeSection visitIntakeModalitySection">
            <div>{this.props.messages.visit_intake_type}</div>
            <VisitIntakeModalityPicker {...this.props} />
          </div>

          <div className="visitIntakeSection visitIntakeCallbackNumberSection">
            <div>{this.props.messages.visit_intake_callback_number}</div>
            <div>
              {this.props.isPhoneVisit ? this.props.messages.visit_intake_where_can_call : this.props.messages.visit_intake_callback_text}
              <PhoneNumberInput locale={this.props.locale} id="callbackNumber" className="visitIntakeCallbackNumber" placeholder={this.props.messages.visit_intake_enter_phone_number} valueLink={this.props.valueLinks.callbackNumber} />
            </div>
          </div>

          <div className="visitIntakeSection visitIntakeHealthSummary">
            <div>{this.props.messages.visit_intake_health_summary}</div>
            <div>
              <Checkbox id="shareHealthSummary" className="shareHealthSummary" checkedLink={this.props.valueLinks.shareHealthSummary}>
                {this.props.messages.visit_intake_share_health_summary}
              </Checkbox>
            </div>
          </div>
          {this.props.deviceIntegrationMode === awsdk.AWSDKDeviceIntegrationMode.TYTO_LIVESTREAM && <DeviceIntegrationComponent {...this.props} />}
          {this.props.isPhoneVisit && !this.props.appointment &&
            feedbackQuestion &&
            feedbackQuestion.show &&
            <div className="visitIntakeSection visitFeedback">
              <div>{this.props.messages.visit_intake_feedback}</div>
              <div>{feedbackQuestion.questionText}</div>
              <Select id='visitFeedbackSelect' className='visitFeedbackSelect' valueLink={this.props.valueLinks.feedbackAnswer}>
                <option />
                {feedbackQuestion.responseOptions.map((option, index) => (
                  <option key={option + index} value={option}>{option}</option>
                ))}
              </Select>
              {this.props.valueLinks.feedbackAnswer.error &&
                <div className='error'>{this.props.valueLinks.feedbackAnswer.error}</div>
              }
            </div>
          }
          {this.props.isMultipleVideoParticipantsEnabled && !this.props.isPhoneVisit &&
            <InviteGuestComponent {...this.props} />
          }
          <div className="visitIntakeSection visitIntakeDisclaimers">
            <div>{this.props.messages.visit_intake_disclaimers}</div>
            <div>
              <Checkbox id="disclaimerAcknowledged" className="visitIntakeDisclaimers" checkedLink={this.props.valueLinks.disclaimerAcknowledged}>
                <FormattedMessage className="intake_disclaimer" id="visit_intake_disclaimers_ack" defaultMessage={this.props.messages.visit_intake_disclaimers_ack}
                  values={{ linkName: <button className="link-like" onClick={e => this.toggleDisclaimersModal(e)}>{this.props.messages.visit_intake_disclaimers_link_name}</button> }} />
              </Checkbox>
            </div>
          </div>

          <div className="visitIntakeButtons">
            <Button id="back" className="visitBack" onClick={() => this.props.history.goBack()}>{this.props.messages.back}</Button>
            <Button id="submit" className="visitButton" onClick={e => this.props.submitIntake(e)}>{this.props.messages.visit_intake_next}</Button>
          </div>
        </Form>
        <InformationModal
          isOpen={this.state.isDisclaimersModalOpen}
          message={disclaimers}
          header={this.props.messages.visit_intake_disclaimers_popup_title}
          messages={this.props.messages}
          buttonText={this.props.messages.close}
          toggle={this.toggleDisclaimersModal} />
      </div>
    );
  }
}

VisitIntakeComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  visitContext: PropTypes.object.isRequired,
  submitIntake: PropTypes.func.isRequired,
};
VisitIntakeComponent.defaultProps = {};
export default VisitIntakeComponent;
