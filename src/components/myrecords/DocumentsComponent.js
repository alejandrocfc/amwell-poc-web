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
import PDF from './images/pdf.svg';

import './DocumentsComponent.css';
import { openBlob } from '../Util';
import { FormattedDate, FormattedTime } from 'react-intl';


class DocumentsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.paginatedResult = null;
    this.state = {
      loading: false,
      postVisitFollowUpItems: [],
      selectedItem: null,
      selectedFilter: awsdk.AWSDKPostVisitFollowUpItemsTypeFilter.all,
    };
  }

  getFilterDisplayName(filterType) {
    switch(filterType) {
      case awsdk.AWSDKPostVisitFollowUpItemsTypeFilter.appointment:
        return this.props.messages.my_records_documents_filter_appointment;
      case awsdk.AWSDKPostVisitFollowUpItemsTypeFilter.imagingReferral:
        return this.props.messages.my_records_documents_filter_imaging;
      case awsdk.AWSDKPostVisitFollowUpItemsTypeFilter.labReferral:
        return this.props.messages.my_records_documents_filter_lab;
      case awsdk.AWSDKPostVisitFollowUpItemsTypeFilter.visitReferral:
        return this.props.messages.my_records_documents_filter_visit;
      case awsdk.AWSDKPostVisitFollowUpItemsTypeFilter.referral:
        return this.props.messages.my_records_documents_filter_referral;
      case awsdk.AWSDKPostVisitFollowUpItemsTypeFilter.sickSlip:
        return this.props.messages.my_records_documents_filter_sick;
      default:
        return this.props.messages.my_records_documents_filter_all;
    }
  }

  getItemDateHeader(type) {
    switch(type) {
      case awsdk.AWSDKPostVisitFollowUpItemType.APPOINTMENT:
        return this.props.messages.my_records_documents_date_appointment;
      case awsdk.AWSDKPostVisitFollowUpItemType.REFERRAL:
        return this.props.messages.my_records_documents_date_referral;
      default:
        return this.props.messages.my_records_documents_date_sick;
    }
  }

  componentDidMount() {
    this.filterOptions = Object.values(awsdk.AWSDKPostVisitFollowUpItemsTypeFilter)
      .map(v => <option key={v} value={v}>{this.getFilterDisplayName(v)}</option>);

    this.fetchItems();
  }

  fetchItems(options = { type: this.state.selectedFilter, pageSize: 10 }) {
    this.setState({ loading: true });
    this.props.sdk.consumerService.searchPostVisitFollowUpItems(this.props.activeConsumer, options)
      .then(paginatedPostVisitFollowUpItems => {
        this.paginatedResult = paginatedPostVisitFollowUpItems;
        this.setState({
          loading: false,
          postVisitFollowUpItems: [...this.state.postVisitFollowUpItems, ...paginatedPostVisitFollowUpItems.postVisitFollowUpItems],
        }, () => {
          // preselect first item
          if (!this.state.selectedItem  && this.state.postVisitFollowUpItems.length > 0) {
            this.setState({
              selectedItem: this.state.postVisitFollowUpItems[0]
            });
          }
        });
      })
      .catch((error) => this.props.handleError(error));
  }

  downloadPDF() {
    this.props.enableSpinner();
    this.props.sdk.consumerService.getPostVisitFollowUpItemPDF(this.props.activeConsumer, this.state.selectedItem)
      .then(blob => openBlob(blob))
      .catch((error) => this.props.handleError(error))
      .finally(() => this.props.disableSpinner());
  }

  handleSelectOnChange(event) {
    event.preventDefault();
    this.setState({
      postVisitFollowUpItems: [],
      selectedFilter: event.target.value,
      selectedItem: null }, () => {
      this.fetchItems();
    })
  }

  render() {
    // SIDE BAR ITEMS
    const sideBarItems = this.state.postVisitFollowUpItems.map(record => (
      <MyRecordSideBarItem
        selected={this.state.selectedItem && this.state.selectedItem.id.persistentId === record.id.persistentId}
        key={record.id.persistentId}
        title={record.description}
        footer={
          <>
            <FormattedDate value={record.createdDate} year='numeric' month='long' day='numeric'/>{', '}
            <FormattedTime value={record.createdDate} timeZoneName='short'/>
          </>
        }
        onClick={() => this.setState({ selectedItem: record })}
      />
    ));

    // RIGHT HEADER BUTTONS
    let rightHeaderButtons;
    if (this.state.selectedItem) {
      rightHeaderButtons = [
        <MyRecordHeaderBarButton key="view" icon={ViewIcon} title={this.props.messages.my_records_header_button_view} onClick={() => this.downloadPDF()}/>,
        <MyRecordHeaderBarButton key="print" icon={PrintIcon} title={this.props.messages.my_records_header_button_print} onClick={() => this.downloadPDF()}/>,
      ]
    } else {
      rightHeaderButtons = [];
    }

    return (
      <MyRecordsLayout
        noContentText={this.props.messages.my_records_no_content_documents}
        loading={this.state.loading}
        selectOptions={this.filterOptions}
        onSelectChange={(e) => this.handleSelectOnChange(e)}
        loadMoreText={this.props.messages.my_records_load_more_documents}
        loadNextPage={
          this.paginatedResult
          && this.paginatedResult.nextPageOptions
          && (() => this.fetchItems(this.paginatedResult.nextPageOptions))}
        rightHeaderButtons={rightHeaderButtons}
        sideBarItems={sideBarItems}>
        {this.state.selectedItem
        &&
        <ItemDetail
          dateHeader={this.getItemDateHeader(this.state.selectedItem.type)}
          item={this.state.selectedItem}
          pdfOnClick={() => this.downloadPDF()}/>}
      </MyRecordsLayout>
    );
  }
}

const ItemDetail = props => (
  <div className="myRecordsDocumentsDetail">
    <div className="myRecordsDocumentsDetailHeader">{props.item.description}</div>
    <img src={PDF} alt={props.item.description} onClick={props.pdfOnClick}/>
    <div className="myRecordsDocumentsDetailDateSection">
      <div className="myRecordsDocumentsDetailDateHeader">{props.dateHeader}</div>
      <div>
        <FormattedDate value={props.item.createdDate} year='numeric' month='long' day='numeric'/>
      </div>
    </div>
  </div>
);
export default DocumentsComponent;
