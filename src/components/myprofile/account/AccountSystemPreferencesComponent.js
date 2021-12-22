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
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { Select } from '../../form/Inputs';
import { getLanguage } from '../../Util';
import '../MyProfileComponent.css';

class AccountSystemPreferencesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('AccountSystemPreferencesComponent: this.props', this.props);
  }

  render() {
    const languageOptions = [];
    this.props.supportedLocales.forEach((locale) => {
      const lang = getLanguage(locale);
      const language = this.props.messages[`language_${lang}`];
      languageOptions.push(<option key={locale} value={locale}>{language}</option>);
    });

    const lang = getLanguage(this.props.currentConsumer.preferredLocale);
    const currentLanguage = this.props.messages[`language_${lang}`];

    return (
      <div>
        <div className="myProfileContentSubheader">
          {this.props.messages.my_profile_system_preferences}
          {!this.props.isDependent &&
            <span>
              <span className="myProfileSeparator">|</span>
              <span className="myProfileLink" onClick={() => this.props.toggleEditSystemPreferences()}>{this.props.messages.edit}</span>
            </span>
          }
        </div>
        <div className="myProfileContentDescription">
          {this.props.messages.my_profile_system_preferences_description}
        </div>
        {this.props.isEditSystemPreferences ? (
          <div className="editContainer">
            <div className="myProfileInputContainer">
              <Select id="preferredLanguage" name="preferredLanguage" valueLink={this.props.valueLinks.preferredLanguage} requiredClass='errorInput'>
                {languageOptions}
              </Select>
            </div>
            <div className="myProfileButtonContainer">
              <div className="cancelBtn">
                <Button tabIndex="28" className="myProfileAccountBtn" onClick={() => this.props.toggleEditSystemPreferences()}>{this.props.messages.cancel}</Button>
              </div>
              <div className="saveBtn">
                <Button tabIndex="29" className="myProfileAccountBtn" onClick={e => this.props.updateMyProfileAccount(e, 'systempreferences')}>{this.props.messages.save}</Button>
              </div>
            </div>
          </div>) : (
          <div>
            <div className="myProfileValueContainer">
              <div className="myProfileValueLabel"><div className="labelValue">{this.props.messages.my_profile_preferred_language}</div>
                <div>{currentLanguage}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

AccountSystemPreferencesComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
AccountSystemPreferencesComponent.defaultProps = {};
export default AccountSystemPreferencesComponent;
