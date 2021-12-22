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
import { FormattedDate } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../MyProfileComponent.css';

class ViewConsumerInsuranceComponent extends React.Component {
  render() {
    const labelClassName = classNames({
      labelCell: true,
      primarySubscriber: (this.props.subscription && !this.props.isPrimary),
    });

    return (
      <div className="myProfileInsurance">
        <div className="rowGroup">
          <div className="myProfileValueContainer">
            <div className={labelClassName}>{this.props.messages.my_profile_insurance_health_plan_label}</div>
            <div className="valueCell">{this.props.subscription ? this.props.subscription.healthPlan.name : this.props.messages.none}</div>
          </div>
          <div className="myProfileValueContainer">
            <div className={labelClassName}>{this.props.messages.my_profile_insurance_subscriber_id_label}</div>
            <div className="valueCell">{this.props.subscription ? this.props.subscription.subscriberId : this.props.messages.none}</div>
          </div>
          { (this.props.subscription && this.props.subscription.subscriberSuffix) &&
            <div className="myProfileValueContainer">
              <div className={labelClassName}>{this.props.messages.my_profile_insurance_subscriber_suffix_label}</div>
              <div className="valueCell">{this.props.subscription.subscriberSuffix}</div>
            </div>
          }
          {(this.props.subscription && !this.props.isPrimary) &&
          <div className="rowGroup">
            <div className="myProfileValueContainer">
              <div className={labelClassName}>{this.props.messages.my_profile_insurance_primary_subscriber_name_label}</div>
              <div className="valueCell">{this.props.subscription.primarySubscriberFirstName} {this.props.subscription.primarySubscriberLastName}</div>
            </div>
            <div className="myProfileValueContainer">
              <div className={labelClassName}>{this.props.messages.my_profile_insurance_relationship_label}</div>
              <div className="valueCell">{this.props.subscription.relationshipToSubscriberCode.localizedDisplayName}</div>
            </div>
            <div className="myProfileValueContainer">
              <div className={labelClassName}>{this.props.messages.my_profile_dob}</div>
              <div className="valueCell"><FormattedDate value={this.props.dobForDisplay} year='numeric' month='long' day='numeric' timeZone='UTC' /></div>
            </div>
          </div>
          }
        </div>
      </div>
    );
  }
}

ViewConsumerInsuranceComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
ViewConsumerInsuranceComponent.defaultProps = {};
export default ViewConsumerInsuranceComponent;
