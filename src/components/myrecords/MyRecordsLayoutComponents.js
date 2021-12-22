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
import PropTypes from 'prop-types';
import classNames from 'classnames';
import loader from './images/loader.svg';
import './MyRecordsLayoutComponent.css';

export const MyRecordsLayout = props =>(
  <div className="myRecordsComponentContent">
    <div className="recordsHeaderBar">
      {props.selectOptions && props.selectOptions.length > 0 &&
      <select className="recordsHeaderSelect" onChange={props.onSelectChange}>
        {props.selectOptions}
      </select>}
      <div className="recordsHeaderSpacer"/>
      <div className="recordsHeaderButtonsContainer">
        <div className="recordsHeaderButtonsLeft">
          {props.leftHeaderButtons}
        </div>
        <div className="recordsHeaderButtonsRight">
          {props.rightHeaderButtons}
        </div>
      </div>
    </div>
    <div className="recordsBody">
      <div className="recordsSideBarScrollContainer">
        <div className="recordsSideBar">
          {props.sideBarItems}

          {/*show the"load more" link or the loading icon*/}
          {(props.loadNextPage || props.loading) &&
          <div className="recordsSideBarBumper">
            {props.loading ?
              <img src={loader} alt="loading" className="recordsSideBarLoading"/>
            :
              <button className="link-like" onClick={(e) => {
                e.preventDefault();
                props.loadNextPage();
              }}>{props.loadMoreText}</button>}
          </div>}
        </div>
      </div>
      <div className="recordsContentScrollContainer">
        <div className="recordsContent">
          {(!props.loading && !props.sideBarItems.length && <div className="noContentText">{props.noContentText}</div>)}
          {props.children}
        </div>
      </div>
    </div>
  </div>
);


MyRecordsLayout.propTypes = {
  onSelectChange: PropTypes.func,
  selectOptions: PropTypes.array,
  leftHeaderButtons: PropTypes.array,
  rightHeaderButtons: PropTypes.array,
  sideBarItems: PropTypes.array,
  loadNextPage: PropTypes.func,
  loadMoreText: PropTypes.string,
  loading: PropTypes.bool,
  noContentText: PropTypes.string,
};
MyRecordsLayout.defaultProps = {};

export const MyRecordSideBarItem = props => (
  <div className={classNames('recordsSideBarItem', { selected: props.selected })} onClick={props.onClick}>
    <div className="recordsSideBarTitle">
      {props.title}
    </div>
    <div className="recordsSideBarText">
      {props.text}
    </div>
    <div className="recordsSideBarFooter">
      {props.footer}
    </div>
  </div>
);

MyRecordSideBarItem.propTypes = {
  title: PropTypes.any,
  text: PropTypes.any,
  footer: PropTypes.any,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};
MyRecordSideBarItem.defaultProps = {};

export const MyRecordHeaderBarButton = props => (
  <div className="recordsHeaderBarButton">
    <img src={props.icon} alt={props.title} onClick={props.onClick}/>
    <span>{props.title}</span>
  </div>
);

MyRecordHeaderBarButton.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func
};
MyRecordHeaderBarButton.defaultProps = {};

