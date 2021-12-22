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
import * as React from 'react';
import awsdk from 'awsdk';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import './VisitSummaryComponents.css';

export function HeaderWithBar(props) {
  return (
    <div className="VisitSummaryHeaderWithBar">
      {props.header}
      <hr/>
    </div>);
}
HeaderWithBar.propTypes = {
  header: PropTypes.string.isRequired,
};


export function TitleAndText(props) {
  return (
    <div className={props.inline ? 'VisitSummaryTitleAndText inline' : 'VisitSummaryTitleAndText'}>
      <div className="bolderText">{props.title}</div>
      <div className={props.text ? 'text' : 'text noResponse'}>{props.text || props.noText || ''}</div>
    </div>
  );
}
TitleAndText.propTypes = {
  title: PropTypes.string.isRequired,
  noText: PropTypes.string,
  text: PropTypes.string,
};


export function PrescriptionsAndPharmacy(props) {
  return (
    <div className="VisitSummaryPrescriptionsAndPharmacy smallerText">

      <HeaderWithBar header={props.messages.visit_report_detail_prescriptions}/>

      <div className="VisitSummaryPrescriptionList">
        {props.prescriptions.map(item =>
          <TitleAndText key={item.id.persistentId} title={item.description} text={item.rxInstructions}/>)}
      </div>

      {props.pharmacy &&
      <div>
        <div className="willBeSent">{props.messages.visit_report_detail_will_be_sent}</div>
        <div className="VisitSummaryPharmacyInfo">
          <div className="bolderText">{props.pharmacy.name}</div>
          {props.pharmacy.address &&
          <div>
            <div>{props.pharmacy.address.address1}</div>
            <div>{props.pharmacy.address.address2}</div>
            <div>{props.pharmacy.address.city}, {props.pharmacy.address.stateCode} {props.pharmacy.address.zipCode}</div>
          </div>}
          <div>{props.messages.visit_report_phone} {props.pharmacy.phone}</div>
        </div>
      </div>}

    </div>
  );
}
PrescriptionsAndPharmacy.propTypes = {
  messages: PropTypes.any.isRequired,
  pharmacy: PropTypes.object.isRequired,
  prescriptions: PropTypes.array.isRequired,
};


export function DiagnosesAndProcedures(props) {
  let diagnosesAndProcedures = [];
  if (props.diagnoses) {
    diagnosesAndProcedures = diagnosesAndProcedures.concat(props.diagnoses);
  }

  if (props.procedures) {
    diagnosesAndProcedures = diagnosesAndProcedures.concat(props.procedures);
  }

  return (
    <div className="visitSummaryDiagnosesAndProcedures">
      <HeaderWithBar header={props.messages.visit_report_detail_diagnoses_and_procedures}/>

      <table>
        <thead>
          <tr>
            <th>{props.messages.visit_report_diagnoses_code}</th>
            <th>{props.messages.visit_report_diagnoses_description}</th>
          </tr>
        </thead>
        <tbody>
          {diagnosesAndProcedures.map(thing =>
            <tr key={thing.code}>
              <td>{thing.code}</td>
              <td>{thing.description}</td>
            </tr>)}
        </tbody>
      </table>
    </div>
  );
}
DiagnosesAndProcedures.propTypes = {
  diagnoses: PropTypes.array.isRequired,
  procedures: PropTypes.array.isRequired,
  messages: PropTypes.any.isRequired,
};


export class FollowUpList extends React.Component {
  getFollowUpMessageResource(itemType) {
    switch (itemType) {
      case awsdk.AWSDKAgendaItemFollowUpType.Visit:
        return this.props.messages.visit_summary_followup_type_engagement;
      case awsdk.AWSDKAgendaItemFollowUpType.TrackerReminder:
        return this.props.messages.visit_summary_followup_type_tracker;
      case awsdk.AWSDKPostVisitFollowUpItemType.SICKSLIP:
        return this.props.messages.visit_summary_followup_type_sickslip;
      case awsdk.AWSDKPostVisitFollowUpItemType.REFERRAL:
        return this.props.messages.visit_summary_followup_type_referral;
      default:
        return this.props.messages.visit_summary_followup_type_default;
    }
  }

  render() {
    return (
      <div>
        <HeaderWithBar header={this.props.title}/>
        {this.props.followUpItems.map(item =>
          <TitleAndText key={item.id.persistentId}
            title={this.getFollowUpMessageResource(item.type)}
            text={item.description}
            inline={true} />)}
      </div>);
  }
}
FollowUpList.propTypes = {
  messages: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  followUpItems: PropTypes.array.isRequired,
};


export function TopicsAndTriage(props) {
  const provSpecialty = (props.oldSpecialty && props.provider.specialty.value !== props.oldSpecialty) ? props.oldSpecialty : props.provider.specialty.value;
  return (
    <div className="visitSummaryTopicsAndTriage">
      <HeaderWithBar header={props.messages.visit_report_detail_topics}/>
      <FormattedMessage id="conversationWith" defaultMessage={ props.messages.visit_report_detail_conversation_with } values={{ specialty: provSpecialty }}/>

      {props.topics && props.topics.length > 0 &&
      <div>
        <div className="bolderText topicsSubHeader">
          {props.messages.visit_report_detail_topics_lower}
        </div>
        {props.topics.map(topic => <div key={topic.id.persistentId}>{topic.description}</div>)}
      </div>}

      {props.triageQuestions &&
      <div>
        <div className="bolderText topicsSubHeader">
          {props.messages.visit_report_detail_triage}
        </div>
        {props.triageQuestions.map(question =>
          (<TitleAndText
            key={question.question}
            title={question.question}
            text={question.answer}
            noText={props.messages.visit_report_detail_no_response}/>))}
      </div>}
    </div>
  );
}
TopicsAndTriage.propTypes = {
  messages: PropTypes.any.isRequired,
  provider: PropTypes.object.isRequired,
  triageQuestions: PropTypes.array,
  topics: PropTypes.array,
};
