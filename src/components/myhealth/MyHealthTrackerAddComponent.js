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
import { Button, Form, FormGroup } from 'reactstrap';
import { NumberInput, TextInput } from '../form/Inputs';
import InformationModal from '../popups/info/InformationModal';

const MyHealthTrackerAddComponent = (props) => {
  props.logger.debug('MyHealthTrackerAddComponent: props', props);
  let tabIndex = 0;
  const trackerPlaceholderMaxLen = 11;
  return (
    <div>
      <div className="myhealth-tracker-template-title">{props.trackerTemplate.title}</div>
      <div className="myHealthContentDescription">{props.messages.tracker_entry_add_description}</div>
      <div className="myhealth-tracker-add-content">
        <Form id="healthTrackerEntryAdd" onSubmit={props.addHealthTracker}>
          <FormGroup check>
            <div className='myhealth-tracker-row myhealth-tracker-entry-input-row'>
              {props.trackerTemplate.components.map((trackerComponent) => {
                tabIndex += 1;
                const id = trackerComponent.uuid;
                const placeholder = (trackerComponent.title.length > trackerPlaceholderMaxLen) ? props.messages.tracker_entry_add_placeholder : trackerComponent.title;
                return (
                  <div key={trackerComponent.uuid} className="myhealth-tracker-cell">
                    <NumberInput tabIndex={tabIndex} className="myhealth-tracker-input" id={id} name={id} positive='true' valueLink={props.valueLinks[id]} placeholder={placeholder} shouldDisplayError={true}/>
                    <div className="myhealth-tracker-units" dangerouslySetInnerHTML={{ __html: trackerComponent.unitOfMeasureShortDescription }}></div>
                  </div>);
              })
              }
            </div>
            <div className="myhealth-tracker-entry-date-time myhealth-tracker-entry-input-row">
              <div className="myhealth-tracker-entry-date-cell">
                <div className="myhealth-tracker-label myhealth-tracker-date-label">{props.messages.tracker_entry_add_date}</div>
                <TextInput tabIndex={tabIndex + 1} type="text" id="healthTrackerMeasurementDate" name="measurementDate" className="myhealth-tracker-input" valueLink={props.valueLinks.measurementDate} placeholder="mm/dd/yy" maxLength='8' />
              </div>
              <div className="myhealth-tracker-entry-time-cell">
                <div className="myhealth-tracker-label myhealth-tracker-time-label">{props.messages.tracker_entry_add_time}</div>
                <TextInput tabIndex={tabIndex + 2} type="text" id="healthTrackerMeasurementTime" name="measurementTime" className="myhealth-tracker-input" valueLink={props.valueLinks.measurementTime} placeholder="hh:mm am/pm" maxLength='8' />
              </div>
            </div>
            <div className='myhealth-tracker-footer'>
              <Button tabIndex={tabIndex + 3} className="myhealth-tracker-button" id="healthTrackerSaveButton" disabled={!props.canAddHealthTracker()}>
                {props.messages.add2}
              </Button>
            </div>
          </FormGroup>
        </Form>
        <InformationModal
          isOpen={props.isTrackerEntryAddedModalOpen}
          message={props.messages.tracker_entry_added_modal_message}
          header={props.messages.tracker_entry_added_modal_header}
          messages={props.messages}
          buttonText={props.messages.ok}
          toggle={props.toggleTrackerEntryAddedModal}
          direction={props.direction}/>
      </div>
    </div>
  );
};

MyHealthTrackerAddComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  valueLinks: PropTypes.object.isRequired,
  trackerTemplate: PropTypes.object.isRequired,
  canAddHealthTracker: PropTypes.func.isRequired,
  isTrackerEntryAddedModalOpen: PropTypes.bool.isRequired,
  toggleTrackerEntryAddedModal: PropTypes.func.isRequired,
};
MyHealthTrackerAddComponent.defaultProps = {};
export default MyHealthTrackerAddComponent;
