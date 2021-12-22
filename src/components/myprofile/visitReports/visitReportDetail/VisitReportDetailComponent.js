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
import { FormattedNumber, FormattedMessage, FormattedDate } from 'react-intl';
import classNames from 'classnames';

import { DiagnosesAndProcedures, HeaderWithBar, PrescriptionsAndPharmacy, TopicsAndTriage, FollowUpList } from '../../../visitSummary/VisitSummaryComponents';
import reconnectLogo from './images/icon-reconnect-detail.svg';

import './VisitReportDetailComponent.css';
import TranscriptComponent from '../../../visit/chat/TranscriptComponent';

class VisitReportDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    const hasStuff = (thing) => {
      if (!thing) return false;
      return (Array.isArray(thing) || typeof thing === 'string') && thing.length > 0;
    };
    this.showTopics = hasStuff(this.props.visitReportDetail.intake.topics) || hasStuff(this.props.visitReportDetail.triageQuestions);
    this.showTranscript = hasStuff(this.props.visitReportDetail.chatReport.chatItems);
    this.showProviderNotes = hasStuff(this.props.visitReportDetail.providerEntries.notes);
    this.showPrescriptions = hasStuff(this.props.visitReportDetail.providerEntries.prescriptions);
    this.showDiagnosesAndProcedures = hasStuff(this.props.visitReportDetail.providerEntries.diagnoses) || hasStuff(this.props.visitReportDetail.providerEntries.procedures);
    this.showFollowUp = hasStuff(this.props.visitReportDetail.providerEntries.agendaItemFollowUps);
    this.showAdditionalItems = hasStuff(this.props.visitReportDetail.providerEntries.postVisitFollowUpItems);
    this.showReleaseStatement = hasStuff(this.props.visitReportDetail.acceptedDisclaimers);
    this.topicsRef = null;
    this.transcriptRef = null;
    this.providerNotesRef = null;
    this.prescriptionsRef = null;
    this.diagnosesAndProceduresRef = null;
    this.additionalItemsRef = null;
    this.followUpRef = null;
    this.releaseStatementRef = null;
    props.logger.debug('VisitReportDetailComponent: props', props);
  }

  scrollTo(ref) {
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }

  extractSpecialtyFromTitle(title) {
    if (title) {
      const res = title.split(', ');
      if (res.length === 2) {
        return res[1];
      }
    }
    return null;
  }

  render() {
    const report = this.props.visitReportDetail;
    const duration = report.schedule ? report.schedule.actualDurationMs : 0;
    const specialtyAtVisitTime = this.extractSpecialtyFromTitle(report.title);
    const visitCost = report.visitCost;
    const reportDisplayAmount = <FormattedNumber value={report.isSuppressChargeTimeout ? visitCost.expectedConsumerCopayCost : report.paymentAmount} // eslint-disable-next-line
      style='currency' currency={this.props.sdk.getSystemConfiguration().currencyCode} minimumFractionDigits={2} maximumFractionDigits={2}/>;

    return (
      <div className="visitReportDetailComponent">
        {!this.props.hideHeader &&
        <div className="header">
          {this.props.messages.visit_report_detail_visit_report}
        </div>}
        {!this.props.hidePDFDownload &&
        <div className="downloadPdf">
          {this.props.canReconnect && this.props.canReconnect(report) && <div className='reconnect-detail-icon hoverFadeLink' onClick={this.props.reconnectToProvider}><img src={reconnectLogo} alt={this.props.messages.visit_report_detail_reconnect_icon_alt} /><span className='reconnect-detail-text'>{this.props.messages.visit_report_detail_reconnect_to_provider}</span><span>|</span></div>}
          <div className="downloadIconAndText hoverFadeLink" onClick={this.props.downloadVisitReport}>
            <span className="downloadPdfIcon"/>
            <span>{this.props.messages.visit_report_detail_download_pdf}</span>
          </div>
        </div>}
        <div className={classNames("content", { noContentPadding: this.props.noContentPadding })}>
          <div className="titleText">
            {report.title}
            {this.props.reportDate &&
            <div className="bolderText visitTime">
              <FormattedDate value={this.props.reportDate} year='numeric' month='short' day='2-digit'/>
              {' | '}
              <FormattedDate value={this.props.reportDate} hour='2-digit' minute='2-digit' timeZoneName='short'/>
              {' - '}
              <FormattedDate value={new Date(this.props.reportDate + duration)} hour='2-digit' minute='2-digit' timeZoneName='short'/>
            </div>}
          </div>
          <hr/>
          <div className="visitReportCost">
            <span className="bolderText cost">{this.props.messages.visit_report_detail_cost} </span>
            {report.isSuppressChargeTimeout &&
              <span className="smallerText">
                <FormattedMessage id="suppressedMaxMessage"
                  defaultMessage={ this.props.messages.visit_cost_payment_suppressed_max } values={{ cost: <span className="moneyAmount">{reportDisplayAmount}</span> }}/>
              </span>
            }
            {!report.isSuppressChargeTimeout &&
            <span>
              <span className="moneyAmount">{reportDisplayAmount}</span>
              <span className="smallerText">
                {report.couponCode &&
                  <FormattedMessage id="couponCode" defaultMessage={ this.props.messages.visit_report_detail_coupon_was_applied } values={{ couponCode: report.couponCode }}/>}
                {report.paymentType && report.paymentAmount > 0 &&
                <FormattedMessage id="paymentType" defaultMessage={ this.props.messages.visit_report_detail_paid_by } values={{ paymentType: report.paymentType }}/>}
              </span>
            </span>
            }
          </div>
          <div className="visitReportTableOfContents">
            <HeaderWithBar header={this.props.messages.visit_report_detail_contents}/>
            <ul className="links">
              {this.showTopics &&
              <li onClick={() => this.scrollTo(this.topicsRef)} className="hoverFadeLink">{this.props.messages.visit_report_toc_visit_topics}</li>}

              {this.showTranscript &&
              <li onClick={() => this.scrollTo(this.transcriptRef)} className="hoverFadeLink">{this.props.messages.visit_report_toc_visit_transcript}</li>}

              {this.showProviderNotes &&
              <li onClick={() => this.scrollTo(this.providerNotesRef)} className="hoverFadeLink">{this.props.messages.visit_report_toc_provider_notes}</li>}

              {this.showPrescriptions &&
              <li onClick={() => this.scrollTo(this.prescriptionsRef)} className="hoverFadeLink">{this.props.messages.visit_report_toc_prescriptions}</li>}

              {this.showDiagnosesAndProcedures &&
              <li onClick={() => this.scrollTo(this.diagnosesAndProceduresRef)} className="hoverFadeLink">{this.props.messages.visit_report_toc_diagnoses_procedures}</li>}

              {this.showFollowUp &&
              <li onClick={() => this.scrollTo(this.followUpRef)} className="hoverFadeLink">{this.props.messages.visit_report_toc_follow_up}</li>}

              {this.showAdditionalItems &&
              <li onClick={() => this.scrollTo(this.additionalItemsRef)} className="hoverFadeLink">{this.props.messages.visit_report_toc_additional_items}</li>}

              {this.showReleaseStatement &&
              <li onClick={() => this.scrollTo(this.releaseStatementRef)} className="hoverFadeLink">{this.props.messages.visit_report_toc_release_statements}</li>}
            </ul>
          </div>

          {this.showTopics &&
          <div className="visitReportTopics" ref={(element) => { this.topicsRef = element; }}>
            <TopicsAndTriage
              messages={this.props.messages}
              provider={report.assignedProvider}
              triageQuestions={report.triageQuestions}
              topics={report.intake.topics}
              oldSpecialty={specialtyAtVisitTime}/>
          </div>}

          {this.showTranscript &&
          <div className="visitReportTranscript" ref={(element) => { this.transcriptRef = element; }}>
            <HeaderWithBar header={this.props.messages.visit_report_detail_visit_transcript}/>
            <div className="transcriptWindow">
              <TranscriptComponent messages={this.props.messages} chatItems={report.chatReport.chatItems}/>
            </div>
          </div>}

          {this.showProviderNotes &&
          <div className="visitReportProviderNotes" ref={(element) => { this.providerNotesRef = element; }}>
            <HeaderWithBar header={this.props.messages.visit_report_detail_notes} />
            <div dangerouslySetInnerHTML={{ __html: report.providerEntries.notes }}/>
          </div>}

          {this.showPrescriptions &&
          <div className="visitReportPrescriptions" ref={(element) => { this.prescriptionsRef = element; }}>
            <PrescriptionsAndPharmacy messages={this.props.messages} pharmacy={report.pharmacy} prescriptions={report.providerEntries.prescriptions}/>
          </div>}

          {this.showDiagnosesAndProcedures &&
          <div className="visitReportDiagnosesAndProcedures" ref={(element) => { this.diagnosesAndProceduresRef = element; }}>
            <DiagnosesAndProcedures messages={this.props.messages} diagnoses={report.providerEntries.diagnoses} procedures={report.providerEntries.procedures}/>
          </div>}

          {this.showFollowUp &&
          <div className="visitReportFollowUp" ref={(element) => { this.followUpRef = element; }}>
            <FollowUpList title={this.props.messages.visit_report_detail_follow_up} followUpItems={report.providerEntries.agendaItemFollowUps} messages={this.props.messages}/>
          </div>}

          {this.showAdditionalItems &&
          <div className="visitReportAdditionalItems" ref={(element) => { this.additionalItemsRef = element; }}>
            <FollowUpList title={this.props.messages.visit_report_detail_additional_items} followUpItems={report.providerEntries.postVisitFollowUpItems} messages={this.props.messages}/>
          </div>}

          {this.showReleaseStatement &&
          <div className="visitReportReleases" ref={(element) => { this.releaseStatementRef = element; }}>
            <HeaderWithBar header={this.props.messages.visit_report_detail_release_statement}/>
            <FormattedMessage
              id="releaseStatements"
              defaultMessage={ this.props.messages.visit_report_detail_has_accepted }
              values={
                { name: `${report.consumer.firstName} ${report.consumer.middleInitial || report.consumer.middleName || ''} ${report.consumer.lastName}`,
                  statements: report.acceptedDisclaimers }}/>
          </div>}
        </div>
      </div>
    );
  }
}

VisitReportDetailComponent.propTypes = {
  hideHeader: PropTypes.bool,
  hidePDFDownload: PropTypes.bool,
  noContentPadding: PropTypes.bool,
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  downloadVisitReport: PropTypes.func.isRequired,
  visitReportDetail: PropTypes.object.isRequired,
  canReconnect: PropTypes.func,
  reconnectToProvider: PropTypes.func,
};
VisitReportDetailComponent.defaultProps = {};
export default VisitReportDetailComponent;
