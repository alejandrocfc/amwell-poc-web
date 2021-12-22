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
import awsdk from 'awsdk';

const VisitIntakeModalityPicker = (props) => {
  const canPickModality = props.availableModalities.length > 1;

  return (
    <div>
      {canPickModality &&
      <div>
        <div>{props.messages.visit_intake_type_what_type}</div>
        {props.availableModalities.map(modality => (
          <label key={modality.name}>
            <input
              type="radio"
              name={modality.name}
              checked={modality.modalityType === props.visitModalityType}
              onChange={() => props.setVisitModalityType(modality.modalityType)}/>
            {modality.localizedDisplayName}
          </label>))
        }
      </div>}

      {!canPickModality &&
      <div>
        {props.availableModalities[0].localizedDisplayName}
      </div>}

      {props.visitModalityType === awsdk.AWSDKVisitModalityType.PHONE &&
      <div className="visitIntakeModalityPhoneOnly">
        {props.messages.visit_intake_type_phone_selected}
      </div>}
    </div>
  );
};

VisitIntakeModalityPicker.propTypes = {
  messages: PropTypes.any.isRequired,
  availableModalities: PropTypes.array.isRequired,
  visitModalityType: PropTypes.any.isRequired,
  setVisitModalityType: PropTypes.func.isRequired,
};
VisitIntakeModalityPicker.defaultProps = {};
export default VisitIntakeModalityPicker;
