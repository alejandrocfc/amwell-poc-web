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
import AttachmentIcon from './images/attachment.svg';
import AttachIcon from './images/icon-attach.svg';
import ViewPDFIcon from './images/icon-pdf.svg';
import ViewIcon from './images/icon-view.svg';
import PrintIcon from './images/icon-print.svg';
import DeleteIcon from './images/icon-delete.svg';
import PDF from './images/pdf.svg';

import './AttachmentsComponent.css';
import loader from './images/loader.svg';
import { openBlob } from '../Util';
import { FormattedDate, FormattedTime } from 'react-intl';

const isImage = (attachment) => {
  return attachment.type.includes('image');
};

const isPDF = (attachment) => {
  return attachment.type.includes('pdf');
};

const formatAttachmentName = (attachmentName) => {
  const pieces = attachmentName.split('_');
  const name = pieces[0];
  const morePieces = pieces[pieces.length - 1].split('.');
  const extension = morePieces[morePieces.length - 1];
  return `${name}.${extension}`;
};

class AttachmentsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.paginatedResult = null;
    this.fileInputRef = React.createRef();
    this.state = {
      loading: false,
      attachments: [],
      selectedAttachment: null,
      selectedAttachmentBLOB: null
    };
  }

  componentDidMount() {
    this.fetchAttachments(true);
  }

  fetchAttachments(fresh = false, options = { pageSize: 10, sortAsc: false }) {
    this.setState({ loading: true });
    this.props.sdk.consumerService.searchHealthDocumentRecords(this.props.activeConsumer, options)
      .then(paginatedHealthDocumentRecords => {
        this.paginatedResult = paginatedHealthDocumentRecords;
        this.setState({
          loading: false,
          attachments: fresh ? paginatedHealthDocumentRecords.healthDocumentRecords : [...this.state.attachments, ...paginatedHealthDocumentRecords.healthDocumentRecords],
        }, () => {
          // preselect first one
          if (!this.state.selectedAttachment && this.state.attachments.length > 0) {
            this.handleSidebarItemClick(this.state.attachments[0]);
          }
        });
      })
      .catch((error) => this.props.handleError(error));
  }

  selectFile(e) {
    this.props.enableSpinner();
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (() => {
      this.props.sdk.consumerService.addHealthDocumentAttachment(this.props.activeConsumer, new Blob([fileReader.result], { type: file.type }), file.name)
        .then(() => {
          this.fetchAttachments(true);
        })
        .catch((error) => {
          if(error.errorCode === awsdk.AWSDKErrorCode.unsupportedMimeType) {
            this.props.showErrorModal(this.props.messages.secure_message_validation_attachment_unsupported);
          } else if (error.errorCode === awsdk.AWSDKErrorCode.attachmentSizeTooLarge) {
            this.props.showErrorModal(this.props.messages.secure_message_validation_attachment_too_large);
          }
        })
        .finally(() =>  {
            this.props.disableSpinner()
            // clear out selected attachment so 'onChange' fires correctly again
            this.fileInputRef.current.value = null;
        });
    });
    fileReader.onerror = () => this.props.disableSpinner();
    if (file) {
      fileReader.readAsArrayBuffer(file);
    }
  }

  getAttachmentBLOB() {
    if (this.state.selectedAttachmentBLOB) {
      return Promise.resolve(this.state.selectedAttachmentBLOB);
    }
    return this.props.sdk.consumerService.getHealthDocumentRecordAttachment(this.props.activeConsumer, this.state.selectedAttachment)
      .then((blob) => {
        this.setState({ selectedAttachmentBLOB: blob });
        return blob;
      })
      .catch((error) => this.props.handleError(error));
  }

  downloadAttachment() {
    this.props.enableSpinner();
    this.getAttachmentBLOB()
      .then(blob => openBlob(blob))
      .catch((error) => this.props.handleError(error))
      .finally(() => this.props.disableSpinner());
  }

  removeAttachment() {
    this.props.enableSpinner();
    this.props.sdk.consumerService.removeHealthDocumentRecord(this.props.activeConsumer, this.state.selectedAttachment)
      .then(() => {
        const attachments = this.state.attachments.filter(doc => doc.id.persistentId !== this.state.selectedAttachment.id.persistentId);
        this.setState({ attachments, selectedAttachment: null });

        if (attachments.length > 0) {
          this.handleSidebarItemClick(attachments[0]);
        }
      })
      .catch((error) => this.props.handleError(error))
      .finally(() => this.props.disableSpinner());
  }

  handleAttachClick(e) {
    e.preventDefault();
    this.fileInputRef.current.click();
  }

  handleSidebarItemClick(attachment) {
    // if the selected image isn't a PDF then we can grab its URL to display as a thumbnail
    this.setState({ selectedAttachmentBLOB: null, selectedAttachment: attachment },
      () => {
        if  (isImage(this.state.selectedAttachment.attachment)) {
          this.getAttachmentBLOB();
        }
      }
    );
  }

  render() {
    // SIDE BAR ITEMS
    const sideBarItems = this.state.attachments.map(attachment => (
      <MyRecordSideBarItem
        selected={this.state.selectedAttachment && this.state.selectedAttachment.id.persistentId === attachment.id.persistentId}
        key={attachment.id.persistentId}
        title={formatAttachmentName(attachment.name)}
        footer={
          <>
            <FormattedDate value={attachment.uploadDate} year='numeric' month='long' day='numeric'/>{', '}
            <FormattedTime value={attachment.uploadDate} timeZoneName='short'/>
          </>
        }
        onClick={() => this.handleSidebarItemClick(attachment)}
      />
    ));

    // LEFT HEADER BUTTONS
    const leftHeaderButtons = [<MyRecordHeaderBarButton key="attach" icon={AttachIcon} title={this.props.messages.my_records_header_button_attach} onClick={(e) => this.handleAttachClick(e)}/>];

    // RIGHT HEADER BUTTONS
    let rightHeaderButtons;
    if (this.state.selectedAttachment) {
      rightHeaderButtons = [
        <MyRecordHeaderBarButton key="view" icon={isPDF(this.state.selectedAttachment.attachment) ? ViewPDFIcon : ViewIcon} title={this.props.messages.my_records_header_button_view} onClick={() => this.downloadAttachment()}/>,
        <MyRecordHeaderBarButton key="print" icon={PrintIcon} title={this.props.messages.my_records_header_button_print} onClick={() => this.downloadAttachment()}/>,
        <MyRecordHeaderBarButton key="delete" icon={DeleteIcon} title={this.props.messages.my_records_header_button_delete} onClick={() => this.removeAttachment()}/>
      ];
    } else {
      rightHeaderButtons = [];
    }

    return (
      <>
        <MyRecordsLayout
          noContentText={this.props.messages.my_records_no_content_attachments}
          loading={this.state.loading}
          loadMoreText={this.props.messages.my_records_load_more_attachments}
          loadNextPage={
            this.paginatedResult
            && this.paginatedResult.nextPageOptions
            && (() => this.fetchAttachments(false, this.paginatedResult.nextPageOptions))}
          leftHeaderButtons={leftHeaderButtons}
          rightHeaderButtons={rightHeaderButtons}
          sideBarItems={sideBarItems}>

            {this.state.selectedAttachment &&
            <AttachmentDetail
              messages={this.props.messages}
              attachment={this.state.selectedAttachment}
              url={this.state.selectedAttachmentBLOB && URL.createObjectURL(this.state.selectedAttachmentBLOB)}
              attachmentOnClick={() => this.downloadAttachment()}/>}
            <input type="file" className="attachmentHiddenInput" ref={this.fileInputRef} onChange={e => this.selectFile(e)}/>
        </MyRecordsLayout>
      </>
    );
  }
}

const renderAttachmentIcon = props => {
  // if it's an image it's loading or not
  if(isImage(props.attachment.attachment)) {
    if(!props.url) {
      return <img src={loader} alt="loading" className="myRecordsAttachmentsPreviewLoading"/>;
    } else {
      return <img src={props.url} alt={props.attachment.description} onClick={props.attachmentOnClick}/>;
    }
    // if it's a pdf show the pdf icon
  } else if (isPDF(props.attachment.attachment)) {
    return <img src={PDF} alt={props.attachment.description} onClick={props.attachmentOnClick}/>;
  }
  // otherwise just show generic 'attachment' icon
  return <img src={AttachmentIcon} alt={props.attachment.description} onClick={props.attachmentOnClick}/>;
};

const AttachmentDetail = props => (
  <div className="myRecordsAttachmentsDetail">
    <div className="myRecordsAttachmentsDetailTitle">{props.messages.my_records_attachments_title}</div>
    <div className="myRecordsAttachmentsPreview">
      {renderAttachmentIcon(props)}
    </div>
    <div>
      <div className="myRecordsAttachmentsDetailHeader">{props.messages.my_records_attachments_name}</div>
      <div>{formatAttachmentName(props.attachment.name)}</div>
      <div>{props.attachment.description}</div>
    </div>
    <div>
      <div className="myRecordsAttachmentsDetailHeader">{props.messages.my_records_attachments_date}</div>
      <div>
        <FormattedDate value={props.attachment.uploadDate} year='numeric' month='long' day='numeric'/>
      </div>
    </div>
  </div>
);
export default AttachmentsComponent;
