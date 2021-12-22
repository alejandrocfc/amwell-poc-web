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

import React from 'react';
import awsdk from 'awsdk';

import { MyRecordsLayout, MyRecordSideBarItem, MyRecordHeaderBarButton } from './MyRecordsLayoutComponents';
import ViewIcon from './images/icon-pdf.svg';
import PrintIcon from './images/icon-print.svg';

import './VisitsComponent.css';
import VisitReportDetailComponent from '../myprofile/visitReports/visitReportDetail/VisitReportDetailComponent';
import { openBlob } from '../Util';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';


class VisitsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.paginatedResult = null;
    this.years = [];
    this.state = {
      loading: false,
      visitReports: [],
      selectedVisitReport: null,
      visitReportDetails: null,
      filterYear: NaN
    };

    const now = new Date();
    for(let i = 0; i <= 20; i++) {
      this.years.push(now.getFullYear() - i);
    }
  }

  componentDidMount() {
    this.fetchVisitReports();
  }

  fetchVisitReports(options = { pageSize: 10 }) {

    options.dispositions = [
      awsdk.AWSDKDisposition.Bailed,
      awsdk.AWSDKDisposition.Deleted,
      awsdk.AWSDKDisposition.Expired,
      awsdk.AWSDKDisposition.Completed,
      awsdk.AWSDKDisposition.ProviderCanceled,
      awsdk.AWSDKDisposition.ConsumerCanceled,
      awsdk.AWSDKDisposition.ConsumerDisconnected,
      awsdk.AWSDKDisposition.ProviderDisconnected,
      awsdk.AWSDKDisposition.ProviderResponseTimeout
    ];

    if(this.state.filterYear) {
      options.startDate = new Date(this.state.filterYear, 1);
      options.endDate = new Date(this.state.filterYear, 12);
    }
    this.setState({ loading: true });
    this.props.sdk.consumerService.searchVisitReports(this.props.activeConsumer, options)
      .then((paginatedResult) => {
        this.paginatedResult = paginatedResult;
        this.setState({ visitReports: [...this.state.visitReports, ...paginatedResult.visitReports], loading: false },
          () => {
            // pre-select first one
            if(!this.state.selectedVisitReport && this.state.visitReports.length > 0) {
              this.handleVisitReportClick(this.state.visitReports[0]);
            }
          });
      })
      .catch((error) => this.props.handleError(error));
  }

  handleVisitReportClick(visitReport) {
    this.props.enableSpinner();
    this.setState({ visitReportDetails: null, selectedVisitReport: visitReport });
    this.props.sdk.consumerService.getVisitReportDetail(this.props.activeConsumer, visitReport)
      .then((visitReportDetails) => {
        this.setState({ visitReportDetails });
      })
      .catch((error) => this.props.handleError(error))
      .finally(() => this.props.disableSpinner());
  }

  downloadPDF() {
    this.props.enableSpinner();
    this.props.sdk.consumerService.getVisitReportPDF(this.props.activeConsumer, this.state.selectedVisitReport)
      .then(blob => openBlob(blob))
      .catch((error) => this.props.handleError(error))
      .finally(() => this.props.disableSpinner());
  }

  handleSelectOnChange(event) {
    event.preventDefault();
    this.setState({
      filterYear: event.target.value,
      visitReports: [],
      visitReportDetails: null,
      selectedVisitReport: null }, () => {
      this.fetchVisitReports();
    })
  }

  mapDisposition(disposition) {
    switch(disposition) {
      case awsdk.AWSDKDisposition.Bailed:
      case awsdk.AWSDKDisposition.Deleted:
      case awsdk.AWSDKDisposition.Expired:
      case awsdk.AWSDKDisposition.Completed:
      case awsdk.AWSDKDisposition.ProviderCanceled:
      case awsdk.AWSDKDisposition.ConsumerCanceled:
      case awsdk.AWSDKDisposition.ConsumerDisconnected:
      case awsdk.AWSDKDisposition.ProviderDisconnected:
      case awsdk.AWSDKDisposition.ProviderResponseTimeout:
        return this.props.messages[`visit_disposition_${disposition}`]
      default:
        return disposition;
    }
  }

  getVisitTime(report) {
    return (report.schedule) ? (report.schedule.actualStartTime || report.schedule.cancelledEventTime || report.schedule.waitingRoomEntryTime || null) : null;
  }

  render() {
    // SIDE BAR ITEMS
    const sideBarItems = this.state.visitReports.map(visitReport => (
      <MyRecordSideBarItem
        selected={this.state.selectedVisitReport && this.state.selectedVisitReport.id.persistentId === visitReport.id.persistentId}
        key={visitReport.id.persistentId}
        title={
          <FormattedMessage id="my_records_visits_header" values={ { provider_fullname: visitReport.providerName } } />
        }
        text={visitReport.providerSpecialty.value}
        footer={
          <>
            <FormattedDate value={this.getVisitTime(visitReport)} year='numeric' month='long' day='numeric'/>{', '}
            <FormattedTime value={this.getVisitTime(visitReport)} timeZoneName='short'/>
            <div>{this.mapDisposition(visitReport.disposition)}</div>
          </>
        }
        onClick={() => this.handleVisitReportClick(visitReport)}
      />
    ));

    // RIGHT HEADER BUTTONS
    let rightHeaderButtons;
    if (this.state.selectedVisitReport) {
      rightHeaderButtons = [
        <MyRecordHeaderBarButton key="view" icon={ViewIcon} title={this.props.messages.my_records_header_button_view} onClick={() => this.downloadPDF()}/>,
        <MyRecordHeaderBarButton key="print" icon={PrintIcon} title={this.props.messages.my_records_header_button_print} onClick={() => this.downloadPDF()}/>,
      ];
    } else {
      rightHeaderButtons = [];
    }

    // SELECT OPTIONS
    const options = [
      <option key='all' value=''>{this.props.messages.my_records_visits_select_default}</option>,
      ...this.years.map(y => <option key={y} value={y}>{y}</option>)
    ];

    return (
      <MyRecordsLayout
        noContentText={this.props.messages.my_records_no_content_visits}
        loading={this.state.loading}
        selectOptions={options}
        onSelectChange={(e) => this.handleSelectOnChange(e)}
        loadMoreText={this.props.messages.my_records_load_more_visits}
        loadNextPage={
          this.paginatedResult
          && this.paginatedResult.nextPageOptions
          && (() => this.fetchVisitReports(this.paginatedResult.nextPageOptions))}
        rightHeaderButtons={rightHeaderButtons}
        sideBarItems={sideBarItems}>
          {this.state.visitReportDetails
          && <VisitReportDetailComponent
            {...this.props}
            hideHeader={true}
            hidePDFDownload={true}
            noContentPadding={true}
            downloadVisitReport={() => this.downloadPDF()}
            messages={this.props.messages}
            visitReportDetail={this.state.visitReportDetails}
            logger={this.props.logger}/>}
        </MyRecordsLayout>
    );
  }
}
export default VisitsComponent;
