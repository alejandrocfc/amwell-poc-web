/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2019 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'reactstrap';
import { FormattedDate, FormattedTime, FormattedMessage } from 'react-intl';
import { TextInput } from '../form/Inputs';
import YesNoModal from '../popups/info/YesNoModal';

const MyHealthTrackerEntriesComponent = (props) => {
  props.logger.debug('MyHealthTrackerEntriesComponent: props', props);
  let trackerEntryIndex = 0;
  const hasTrackerEntries = (props.trackerEntries && props.trackerEntries.length > 0);
  return (
    <div className="myhealth-tracker-entries">
      <div className="tracker-entries-filter-input-group">
        <Form id="healthTrackerEntriesFilter">
          <div className="tracker-entries-filter-input-row">
            <div className="myhealth-tracker-label tracker-entries-filter-input-cell">{props.messages.tracker_entries_filter}</div>
            <div className="tracker-entries-filter-input-cell"><TextInput type="text" id="healthTrackerStartDate" name="startDate" className="myhealth-tracker-input" valueLink={props.valueLinks.startDate} placeholder="mm/dd/yy" maxLength='8'/></div>
            <div className="myhealth-tracker-filter-to tracker-entries-filter-input-cell">{props.messages.tracker_entries_to}</div>
            <div className="tracker-entries-filter-input-cell"><TextInput type="text" id="healthTrackerEndDate" name="endDate" className="myhealth-tracker-input" valueLink={props.valueLinks.endDate} placeholder="mm/dd/yy" maxLength='8'/></div>
            {hasTrackerEntries && <div className="tracker-entries-filter-input-cell"><span key="2" className="myHealthLink myhealth-tracker-delete" onClick={event => props.toggleDeleteTrackerEntriesModal(event)}>{props.messages.tracker_delete_data}</span></div>}
          </div>
        </Form>
      </div>
      {!hasTrackerEntries ? <div>{props.messages.tracker_entries_no_data}</div>
        :
        <div className="tracker-entries-grid">
          <div className="tracker-entries-grid-header">
            <div className="myhealth-tracker-cell myhealth-tracker-date-cell">{props.messages.tracker_entry_date}</div>
            <div className="myhealth-tracker-cell myhealth-tracker-time-cell">{props.messages.tracker_entry_time}</div>
            {props.trackerTemplate.components.map(trackerComponent =>
              (<div key={trackerComponent.uuid} className="myhealth-tracker-cell">{trackerComponent.title}</div>))
            }
            <div className="myhealth-tracker-cell"></div>
          </div>
          {props.trackerEntries.map((trackerEntry) => {
            trackerEntryIndex += 1;
            return (
              <div key={trackerEntryIndex} className="myhealth-tracker-entry-row">
                <div className="myhealth-tracker-cell myhealth-tracker-date-cell"><FormattedDate value={trackerEntry.date} year='2-digit' month='2-digit' day='2-digit'/></div>
                <div className="myhealth-tracker-cell"><FormattedTime value={trackerEntry.date} timeZoneName='short'/></div>
                {trackerEntry.data.map(dataPoint => (<div key={dataPoint.uuid} className="myhealth-tracker-cell myhealth-tracker-data-point" dangerouslySetInnerHTML={{ __html: `${dataPoint.value} ${dataPoint.unitOfMeasureShortDescription}` }}></div>))}
                <div className="myhealth-tracker-cell"></div>
              </div>
            );
          })}
        </div>
      }
      <div className="myhealth-tracker-entries-note">
        {props.messages.tracker_entries_previous_data_note}
      </div>
      <div className='myhealth-tracker-footer'>
        <Button className="myhealth-tracker-button" id="back" onClick={() => props.history.goBack()}>
          {props.messages.back}
        </Button>
      </div>
      <YesNoModal
        isOpen={props.isTrackerDeleteModalOpen}
        toggle={props.toggleDeleteTrackerEntriesModal}
        messages={props.messages}
        header={props.messages.tracker_delete_data_modal_header}
        message={<FormattedMessage id="tracker_delete_data_modal_body" values={ { startDate: props.valueLinks.startDate.value, endDate: props.valueLinks.endDate.value } } />}
        yesClickHandler={props.deleteHealthTrackerData}/>
    </div>
  );
};

MyHealthTrackerEntriesComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  valueLinks: PropTypes.object.isRequired,
  trackerTemplate: PropTypes.object.isRequired,
  trackerEntries: PropTypes.array.isRequired,
  isTrackerDeleteModalOpen: PropTypes.bool.isRequired,
  toggleDeleteTrackerEntriesModal: PropTypes.func.isRequired,
};
MyHealthTrackerEntriesComponent.defaultProps = {};
export default MyHealthTrackerEntriesComponent;
