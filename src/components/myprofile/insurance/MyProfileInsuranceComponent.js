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
import { Button, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import '../MyProfileComponent.css';
import ViewConsumerInsuranceComponent from './ViewConsumerInsuranceComponent';
import EditInsuranceComponent from './EditInsuranceComponent';

class MyProfileInsuranceComponent extends React.Component {
  render() {
    return (
      <div className="myProfileContent subscription">
        <div>
          <span className="myProfileContentTitle">{this.props.messages.my_profile_insurance_header}</span>
          { !this.props.isMemberFeedControlled && this.props.sdk.getSystemConfiguration().consumerHealthInsuranceCollected &&
          <span>
            <span className="myProfileSeparator">|</span>
            <span className="myProfileLink" onClick={e => this.props.toggleEditInsurance(e)}>{this.props.messages.edit}</span>
          </span>
          }
        </div>
        <div className="myProfileContentDescription">{this.props.messages.my_profile_insurance_content_description}</div>
        <div className="myProfileAccountContent">
          {(!this.props.isMemberFeedControlled && this.props.isEditInsurance) &&
            <div>
              <div className="insuranceOptionRadio">
                <Label check>
                  <Input value='hasInsurance' checked={this.props.selectedOption === 'hasInsurance'} onChange={() => this.props.setSelectedOption('hasInsurance')} type="radio" name="selectedOption" /> {' '}
                  {this.props.messages.my_profile_insurance_affirmation}
                </Label>
              </div>
              { this.props.selectedOption === 'hasInsurance' &&
                <EditInsuranceComponent {...this.props} />
              }
              <div className="insuranceOptionRadio">
                <Label check>
                  <Input value='noInsurance' checked={this.props.selectedOption === 'noInsurance'} onChange={() => this.props.setSelectedOption('noInsurance')} type="radio" name="selectedOption" />{' '}
                  {this.props.messages.my_profile_insurance_denial}
                </Label>
              </div>
              { this.props.selectedOption === 'noInsurance' &&
                <div className="denialDescription">
                  {this.props.messages.my_profile_insurance_denial_description}
                </div>
              }
              <div className="myProfileButtonContainer">
                <div className="cancelBtn">
                  <Button className="myProfileAccountBtn" onClick={e => this.props.toggleEditInsurance(e)}>{this.props.messages.cancel}</Button>
                </div>
                <div className="saveBtn">
                  <Button className="myProfileAccountBtn" onClick={e => this.props.handleSubmit(e)}>{this.props.messages.save}</Button>
                </div>
              </div>
            </div>
          }
          {!this.props.isEditInsurance &&
            <ViewConsumerInsuranceComponent {...this.props} />
          }
        </div>
      </div>
    );
  }
}

MyProfileInsuranceComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyProfileInsuranceComponent.defaultProps = {};
export default MyProfileInsuranceComponent;
