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
import ReactTooltip from 'react-tooltip';
import { FormattedMessage } from 'react-intl';
import { Input, FormGroup, Label, Col, Row, Button } from 'reactstrap';
import { TextInput, DateInput, Select } from '../../form/Inputs';
import '../MyProfileComponent.css';
import HealthPlanImageComponent from './HealthPlanImageComponent';
import GenericModal from '../../popups/info/GenericModal';

class EditInsuranceComponent extends React.Component {
  render() {
    const healthPlanLink = this.props.valueLinks.healthPlanPersistentId;
    const subscriberIdLink = this.props.valueLinks.subscriberId;
    let activeHealthPlan = null;
    if (healthPlanLink && healthPlanLink.value) {
      activeHealthPlan = this.props.healthPlans.length > 1 ? this.props.healthPlans.find(hp => hp.id.persistentId === healthPlanLink.value) : undefined;
    }
    const showPrimarySubscriberQuestion = activeHealthPlan && activeHealthPlan.payerInfo && activeHealthPlan.payerInfo.showPrimarySubscriberQuestion;
    const suffixLink = this.props.valueLinks.subscriberSuffix;
    const relToPrimarySubscriberLink = this.props.valueLinks.relationshipToSubscriberDisplayName;
    const primarySubscriberFirstNameLink = this.props.valueLinks.primarySubscriberFirstName;
    const primarySubscriberLastNameLink = this.props.valueLinks.primarySubscriberLastName;
    const primarySubscriberDobLink = this.props.valueLinks.primarySubscriberDob;
    const subscriberIdClass = activeHealthPlan && activeHealthPlan.usesSuffix ? 'subscriberIdWithSuffix' : 'subscriberId';
    const subscriberIdMessage = (activeHealthPlan && activeHealthPlan.payerInfo && activeHealthPlan.payerInfo.subscriberIdPattern) ? <FormattedMessage id='fmSubscriberId' values={{ pattern: activeHealthPlan.payerInfo.subscriberIdPattern }} defaultMessage={this.props.messages.my_profile_insurance_subscriber_id_pattern_message} /> : null;
    return (
      <Row>
        <Col>
          <div className="consumerSubscriptionInfo">
            <div className="myProfileInputContainer">
              <Select className="healthPlan" valueLink={healthPlanLink}>
                <option value='' disabled hidden>{this.props.messages.my_profile_insurance_health_plan_label}</option>
                {this.props.healthPlans.map(plan => <option key={plan.id} value={plan.id.persistentId}>{plan.name}</option>)}
              </Select>
            </div>
            <div className="subscriberIdContainer">
              <TextInput data-tip data-for='subscriberIdToolTip' data-event="mouseenter focusin"
                data-event-off="mouseout focusout"className={subscriberIdClass} type="text" id="subscriberId" name="subscriberId" placeholder={this.props.messages.my_profile_insurance_subscriber_id_placeholder} valueLink={subscriberIdLink} />
              {(subscriberIdLink.error && subscriberIdMessage) &&
                <ReactTooltip id='subscriberIdToolTip' place='top' type="warning" effect="solid">
                  {subscriberIdMessage}
                </ReactTooltip>}
              {(activeHealthPlan && activeHealthPlan.usesSuffix) &&
              <div>
                <TextInput className="healthPlanSuffix" type="text"
                  id="subscriberSuffix" name="subscriberSuffix"
                  placeholder={this.props.messages.my_profile_insurance_subscriber_suffix_placeholder}
                  valueLink={suffixLink} />
              </div>
              }
            </div>
            { showPrimarySubscriberQuestion &&
            <div className="myProfileInputContainer primarySubRadio">
              <div>{this.props.messages.my_profile_insurance_primary_subscriber_ask}</div>
              <FormGroup check>
                <Label check>
                  <Input defaultChecked={this.props.identifiesAsPrimary} onClick={() => this.props.setIdentifiesAsPrimary(true)} type="radio" name="identifiesAsPrimary" /> {' '}
                  {this.props.messages.yes}
                </Label>
                <Label check>
                  <Input defaultChecked={!this.props.identifiesAsPrimary} onClick={() => this.props.setIdentifiesAsPrimary(false)} type="radio" name="identifiesAsPrimary" />{' '}
                  {this.props.messages.no}
                </Label>
              </FormGroup>
            </div>}
            {!this.props.identifiesAsPrimary &&
            <div>
              <div className="myProfileInputContainer">
                <Select className="relToPrimarySubscriber" valueLink={relToPrimarySubscriberLink}>
                  <option value='' disabled hidden>{this.props.messages.my_profile_insurance_relationship_label}</option>
                  {this.props.relationshipsToSubscriber.map(rel => <option key={rel.displayName} value={rel.displayName}>{rel.localizedDisplayName}</option>)}
                </Select>
                { relToPrimarySubscriberLink.error &&
                  <div className='relToPrimarySubscriberError error'>{relToPrimarySubscriberLink.error}</div>
                }
              </div>
              <div className="myProfileInputContainer">
                <div className="inputGroupHeader">{this.props.messages.primary_subscriber_name_label}</div>
                <TextInput type="text" id="primarySubscriberFirstName" name="firstName" placeholder={this.props.messages.name_first_name} valueLink={primarySubscriberFirstNameLink} maxLength='100' />
                <TextInput type="text" id="primarySubscriberLastName" name="lastName" placeholder={this.props.messages.name_last_name} valueLink={primarySubscriberLastNameLink} maxLength='100' />
              </div>
              <div className="myProfileInputContainer">
              </div>
              <div className="myProfileInputContainer">
                <div className="inputGroupHeader">{this.props.messages.primary_subscriber_dob_label}</div>
                <DateInput id="primarySubscriberDob" className="myAccountDob" valueLink={primarySubscriberDobLink} {...this.props} />
              </div>
            </div>
            }
            <GenericModal dir={this.props.direction} className="insuranceEligibilityPrompt" isOpen={this.props.eligibilityError} toggle={this.props.toggleEligibilityPrompt}
              header={this.props.messages.my_profile_insurance_eligibility_check_failed}
              message={
                <div className='insuranceEligibilityModalBody'>
                  <div className="description">{this.props.eligibilityErrorMsg}</div>
                  <div className="saveAnyway">{this.props.messages.my_profile_insurance_eligibility_save_anyway}</div>
                </div>
              }>
              <div className='insuranceEligibilityModalFooter'>
                <Button onClick={this.props.toggleEligibilityPrompt}>
                  {this.props.messages.cancel}
                </Button>
                <Button onClick={(e) => { this.props.toggleEligibilityPrompt(e); this.props.updateInsurance(true); }}>{this.props.messages.save}</Button>
              </div>
            </GenericModal>
          </div>
        </Col>
        <Col>
          <HealthPlanImageComponent {... this.props} healthPlan={activeHealthPlan} />
        </Col>
      </Row>
    );
  }
}

EditInsuranceComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
EditInsuranceComponent.defaultProps = {};
export default EditInsuranceComponent;
