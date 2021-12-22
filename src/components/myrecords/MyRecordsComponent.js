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
import TabBar from '../tabs/TabBarComponent';
import Tab from '../tabs/TabComponent';
import { Route } from 'react-router-dom';

import './MyRecordsComponent.css';
import DocumentsComponent from './DocumentsComponent';
import AttachmentsComponent from './AttachmentsComponent';
import VisitsComponent from './VisitsComponent';

class MyRecordsComponent extends React.Component {
  render() {
    return (
      <>
        <TabBar>
          <Tab matchPath="documents" title={this.props.messages.my_records_documents_title} {...this.props}/>
          <Tab matchPath="attachments" title={this.props.messages.my_records_attachment_title} {...this.props}/>
          <Tab matchPath="visits" title={this.props.messages.my_records_visits_title} {...this.props}/>
        </TabBar>

        <Route path={`${this.props.match.url}/documents`} render={() => (
          <DocumentsComponent {...this.props}/>
        )}/>
        <Route path={`${this.props.match.url}/attachments`} render={() => (
          <AttachmentsComponent {...this.props}/>
        )}/>
        <Route path={`${this.props.match.url}/visits`} render={() => (
          <VisitsComponent {...this.props}/>
        )}/>
      </>
    );
  }
}

MyRecordsComponent.propTypes = {};
MyRecordsComponent.defaultProps = {};
export default MyRecordsComponent;
