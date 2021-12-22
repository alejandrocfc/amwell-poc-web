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
import awsdk from 'awsdk';
import React from 'react';
import PropTypes from 'prop-types';

import MyProfileVisitsComponent from '../components/myprofile/visitReports/MyProfileVisitsComponent';

class MyProfileVisitsContainer extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyProfileVisitsContainer: props', props);
    this.toggleVisitReportDetailModal = this.toggleVisitReportDetailModal.bind(this);
    this.reconnectToProvider = this.reconnectToProvider.bind(this);
    this.downloadVisitReport = this.downloadVisitReport.bind(this);
    this.getVisitReportDetail = this.getVisitReportDetail.bind(this);
    this.state = {
      visitReports: [],
      disposition: 'All',
      showVisitReportDetail: false,
      reconnect: false,
    };
  }

  componentDidMount() {
    this.getVisitReports();
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeConsumer.id.persistentId !== prevProps.activeConsumer.id.persistentId) {
      this.getVisitReports();
    }
  }

  getVisitReportDetail(e, visitReport) {
    if (e) e.preventDefault();
    this.props.enableSpinner();
    return this.props.sdk.consumerService.getVisitReportDetail(this.props.activeConsumer, visitReport)
      .then((visitReportDetail) => {
        this.setState({ visitReportDetail, selectedVisitReport: visitReport, showVisitReportDetail: true });
        this.props.disableSpinner();
      })
      .catch((error) => {
        this.handleError(error);
        this.props.disableSpinner();
      });
  }

  downloadVisitReport(e) {
    if (e) e.preventDefault();
    this.props.enableSpinner();
    const isMicrosoftBrowser = window.navigator && window.navigator.msSaveOrOpenBlob;
    const theWindow = !isMicrosoftBrowser ? window.open('') : null;
    return this.props.sdk.consumerService.getVisitReportPDF(this.props.activeConsumer, this.state.selectedVisitReport)
      .then((blob) => {
        if (isMicrosoftBrowser) {
          window.navigator.msSaveOrOpenBlob(blob);
        } else {
          theWindow.location = URL.createObjectURL(blob);
        }
        this.props.disableSpinner();
      })
      .catch((error) => {
        this.handleError(error);
        this.props.disableSpinner();
      });
  }

  getVisitReports() {
    this.props.enableSpinner();
    this.props.sdk.consumerService.searchVisitReports(this.props.activeConsumer)
      .then((visitReportResponse) => {
        const visitReports = visitReportResponse.visitReports;
        this.props.logger.debug('VisitReports: ', visitReports);
        this.setState({ visitReports });
        this.props.disableSpinner();
      })
      .catch((error) => {
        this.handleError(error);
        this.props.disableSpinner();
      });
  }

  reconnectToProvider() {
    this.setState({ reconnect: true });
    this.toggleVisitReportDetailModal();

  }

  handleError(error) {
    if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.props.history.push('/sessionExpired');
    } else {
      this.props.logger.info('Something went wrong:', error);
      this.props.showErrorModal();
    }
  }

  updateDisposition(e) {
    this.setState({ disposition: e.target.value });
  }

  toggleVisitReportDetailModal() {
    this.setState(prevState => ({
      showVisitReportDetail: !prevState.showVisitReportDetail,
    }));
  }

  render() {
    const properties = {
      downloadVisitReport: this.downloadVisitReport,
      updateDisposition: this.updateDisposition.bind(this),
      disposition: this.state.disposition,
      visitReports: this.state.visitReports,
      getVisitReportDetail: this.getVisitReportDetail,
      visitReportDetail: this.state.visitReportDetail,
      showVisitReportDetail: this.state.showVisitReportDetail,
      toggleVisitReportDetailModal: this.toggleVisitReportDetailModal,
      reconnect: this.state.reconnect,
      reconnectToProvider: this.reconnectToProvider,
    };

    return (
      <MyProfileVisitsComponent key="myProfileVisitsComponent" {...properties} {...this.props} />
    );
  }
}

MyProfileVisitsContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyProfileVisitsContainer.defaultProps = {};
export default MyProfileVisitsContainer;
