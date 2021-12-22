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
import awsdk from 'awsdk';
import { FormGroup, Input, Label, Modal } from 'reactstrap';
import { FormattedDate, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import ClassNames from 'classnames';

import './MyProfileVisitsComponent.css';
import VisitReportDetailComponent from './visitReportDetail/VisitReportDetailComponent';
import ReconnectIcon from './images/icon-reconnect.svg';
import ScheduleAppointmentContainer from '../../../containers/ScheduleAppointmentContainer';

class MyProfileVisitsComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyProfileVisitsComponent: props', props);
    this.sortCompare = this.sortCompare.bind(this);
    this.getVisitTime = this.getVisitTime.bind(this);
    this.canReconnect = this.canReconnect.bind(this);
    this.hasFailedDisposition = this.hasFailedDisposition.bind(this);
    this.failedDispositions = [
      'ConsumerDisconnected',
      'ConsumerCanceled',
      'Deleted',
      'ProviderResponseTimeout',
      'Bailed',
      'ProviderDisconnected',
      'ProviderCanceled',
      'Expired'
    ];
  }

  getVisitTime(report) {
    return (report.schedule) ? (report.schedule.actualStartTime || report.schedule.cancelledEventTime || report.schedule.waitingRoomEntryTime || null) : null;
  }

  sortCompare(firstReport, nextReport) {
    return (this.getVisitTime(nextReport) - this.getVisitTime(firstReport));
  }

  canReconnect(report) {
    return this.hasFailedDisposition(report.disposition);
  }

  hasFailedDisposition(disposition) {
    return this.failedDispositions.some(disp => awsdk.AWSDKDisposition[disp] === disposition);
  }

  render() {
    const properties = {
      sortCompare: this.sortCompare,
      getVisitTime: this.getVisitTime,
      canReconnect: this.canReconnect,
      hasFailedDisposition: this.hasFailedDisposition,
    };
    return (
      <div className="myProfileContent">
        <div>
          <span className="myProfileContentTitle">{this.props.messages.previous_visits2}</span>
        </div>
        <div>
          <span className="myProfileContentDescription">{this.props.reconnect ? this.props.messages.previous_visits_reconnect_to_provider_title : this.props.messages.previous_visits_description}</span>
        </div>
        {!this.props.reconnect ?
          <PastVisitReportList {...properties} {...this.props} />
          :
          <ScheduleAppointmentContainer {...this.props} {...properties} providerName={this.props.visitReportDetail.assignedProvider.fullName} practice={this.props.visitReportDetail.practice}/>
        }

      </div>
    );
  }
}

const PastVisitReportList = (props) => {
  let visitReports = [];
  if (props.disposition !== 'All') {
    visitReports = props.visitReports && props.visitReports.length !== 0 ? props.visitReports.filter(report => report.disposition === props.disposition) : [];
  } else {
    visitReports = props.visitReports;
  }
  return (
    <React.Fragment>
      <div className="visitReportDispositions">
        <FormGroup check>
          <div>
            {props.messages.show}
            <Label check>
              <Input type="radio" id='All' className='visitDispositionChoice' name="disposition" value='All' checked={props.disposition === 'All'} onChange={props.updateDisposition}/>
              {props.messages.all}
            </Label>
            <Label check>
              <Input type="radio" id='Completed' className='visitDispositionChoice' name="disposition" value='Completed' checked={props.disposition === 'Completed'} onChange={props.updateDisposition}/>
              {props.messages.completed}
            </Label>
            <Label check>
              <Input type="radio" id='Missed' className='visitDispositionChoice' name="disposition" value='Expired' checked={props.disposition === 'Expired'} onChange={props.updateDisposition}/>
              {props.messages.missed}
            </Label>
            <Label check>
              <Input type="radio" id='Canceled' className='visitDispositionChoice' name="disposition" value='Deleted' checked={props.disposition === 'Deleted'} onChange={props.updateDisposition}/>
              {props.messages.canceled}
            </Label>
          </div>
        </FormGroup>
      </div>
      {!visitReports || visitReports.length === 0 ?
        <div className="visitReportNoReports">{props.messages.previous_visits_no_previous_visits}</div>
        :
        <div>
          <div className="visitReportTitleSection">
            <div>{props.messages.visit_reports_date}</div>
            <div>{props.messages.visit_reports_time}</div>
            <div>{props.messages.visit_reports_provider}</div>
            <hr/>
          </div>
          <div>
            {visitReports.sort((a, b) => props.sortCompare(a, b)).map((report, index) => {
              const visitTime = props.getVisitTime(report);
              const reportDate = (visitTime === null) ? null : new Date(visitTime);
              const canReconnect = props.canReconnect(report);
              const reconnectClass = ClassNames('visitReportReconnectIcon', { reconnect: canReconnect});
              return (
                <div key={report.id.persistentId} className="visitReportListItem">
                  <div className="visitReportDate">{reportDate && <FormattedDate value={reportDate} year='numeric' month='numeric' day='numeric' timeZone='utc'/>}</div>
                  <div className="visitReportTime">{reportDate && <FormattedTime value={reportDate} timeZoneName='short'/>}</div>
                  <div className="visitReportProvider">{report.providerName}, {report.providerSpecialty && report.providerSpecialty.value}</div>
                    <div className={reconnectClass}>
                      <img src={ReconnectIcon} data-tip data-for={`reconnectIconTip${index}`} alt=""/>
                      <ReactTooltip id={`reconnectIconTip${index}`} type='light' effect='solid' className='customClass'
                        getContent={() => {return canReconnect ? <><h6>{props.messages.previous_visits_reconnect_tooltip_title}</h6><span>{props.messages.previous_visits_reconnect_tooltip_description}</span></> : null }}>
                      </ReactTooltip>
                    </div>
                  <div className="visitReportDownload"><button className="link-like" onClick={e => props.getVisitReportDetail(e, report)}>{props.messages.visit_reports_view_report}</button></div>
                  <hr/>
                </div>);
            })}
          </div>
        </div>
      }
      <Modal className="visitReportDetailModal" isOpen={props.showVisitReportDetail}>
        <div className={props.direction} dir={props.direction}>
          <div className="close" onClick={props.toggleVisitReportDetailModal}/>
          {props.visitReportDetail && <VisitReportDetailComponent reportDate={props.getVisitTime(props.visitReportDetail)} canReconnect={props.canReconnect(props.visitReportDetail)} {...props}/>}
        </div>
      </Modal>
    </React.Fragment>
  )
}

MyProfileVisitsComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  downloadVisitReport: PropTypes.func.isRequired,
  updateDisposition: PropTypes.func.isRequired,
  getVisitReportDetail: PropTypes.func.isRequired,
  visitReports: PropTypes.array.isRequired,
  showVisitReportDetail: PropTypes.bool.isRequired,
  toggleVisitReportDetailModal: PropTypes.func.isRequired,
  visitReportDetail: PropTypes.object,
};
MyProfileVisitsComponent.defaultProps = {};
export default MyProfileVisitsComponent;
