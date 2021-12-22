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
import { FormGroup, Input } from 'reactstrap';
import ReactTooltip from 'react-tooltip';
import ValueLink from 'valuelink';
import OptionalHintIcon from './images/optional-hint.png';

import './PasswordComponent.css';

class PasswordComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('PasswordComponent: props', props);
    this.sysConf = props.sdk.getSystemConfiguration();
    this.specialChars = this.sysConf.specialCharacterSetAllowedInPassword.split(',');
  }

  validationClasses(props, value, error) {
    const classNames = props.className ? [props.className] : [];
    if (error) {
      classNames.push(props.invalidClass || 'errorInput');
      if (value === '') {
        classNames.push(props.requiredClass || 'required');
      }
    }
    return classNames.join(' ');
  }

  render() {
    const passwordTip = [];
    passwordTip.push(<div key="title" className="passwordTip Title">{this.props.messages.login_assistance_password_your_password}</div>);
    if (this.props.passwordLink.value.length === 0) {
      passwordTip.push(<div key="length" className="passwordTip Off">{this.sysConf.passwordTooShortMessage}</div>);
    } else if (this.props.passwordLink.value.length < this.sysConf.minPasswordLength) {
      passwordTip.push(<div key="length" className="passwordTip Fail">{this.sysConf.passwordTooShortMessage}</div>);
    } else if (this.props.passwordLink.value.length > this.sysConf.maxPasswordLength) {
      passwordTip.push(<div key="length" className="passwordTip Fail">{this.sysConf.passwordTooLongMessage}</div>);
    } else {
      passwordTip.push(<div key="length" className="passwordTip On">{this.sysConf.passwordTooShortMessage}</div>);
    }

    if (this.sysConf.passwordMustContainLetters) {
      if (this.props.passwordLink.value.length === 0) {
        passwordTip.push(<div key="alpha" className="passwordTip Off">{this.sysConf.passwordRequiresLettersMessage}</div>);
      } else if (!this.props.passwordLink.value.match(/[a-z]/i)) {
        passwordTip.push(<div key="alpha" className="passwordTip Fail">{this.sysConf.passwordRequiresLettersMessage}</div>);
      } else {
        passwordTip.push(<div key="alpha" className="passwordTip On">{this.sysConf.passwordRequiresLettersMessage}</div>);
      }
    }

    if (this.sysConf.passwordMustContainNumbers) {
      if (this.props.passwordLink.value.length === 0) {
        passwordTip.push(<div key="numeric" className="passwordTip Off">{this.sysConf.passwordRequiresNumbersMessage}</div>);
      } else if (!this.props.passwordLink.value.match(/[0-9]/i)) {
        passwordTip.push(<div key="numeric" className="passwordTip Fail">{this.sysConf.passwordRequiresNumbersMessage}</div>);
      } else {
        passwordTip.push(<div key="numeric" className="passwordTip On">{this.sysConf.passwordRequiresNumbersMessage}</div>);
      }
    }

    if (this.sysConf.passwordMustContainSpecialCharacters) {
      if (this.props.passwordLink.value.length === 0) {
        passwordTip.push(<div key="special" className="passwordTip Off">{this.sysConf.passwordRequiresSpecialCharactersMessage}</div>);
      } else {
        let pass = false;
        let ct = 0;
        this.specialChars.forEach((c) => {
          if (this.props.passwordLink.value.includes(c)) {
            ct += 1;
          }
        });
        if (ct >= this.sysConf.minimumNumberOfSpecialCharactersInPassword) {
          pass = true;
        }
        if (!pass) {
          passwordTip.push(<div key="special" className="passwordTip Fail">{this.sysConf.passwordRequiresSpecialCharactersMessage}</div>);
        } else {
          passwordTip.push(<div key="special" className="passwordTip On">{this.sysConf.passwordRequiresSpecialCharactersMessage}</div>);
        }
      }
    }

    const setValue = (x, e) => e.target.value;

    return (
      <FormGroup>
        <Input data-tip data-for={this.props.id} data-event="mouseenter focusin" data-event-off="mouseout focusout"
          name={this.props.name} id={this.props.id} tabIndex={this.props.tabIndex}
          type="password"
          placeholder={this.props.placeholder}
          className={this.validationClasses({ invalidClass: this.props.invalidClass, requiredClass: this.props.requiredClass, ...this.props }, this.props.passwordLink.value, this.props.passwordLink.error)}
          value={this.props.passwordLink.value ? this.props.passwordLink.value : ''}
          onChange={this.props.passwordLink.action(setValue)}/>
        <ReactTooltip id={this.props.id} place={this.props.direction === 'rtl' ? 'left' : 'right'} type="light" effect="solid">
          {passwordTip}
        </ReactTooltip>

        { this.props.passwordLink.error &&
          <div className='error'>{this.props.passwordLink.error}</div>
        }
        { this.props.showOptionalHint &&
        <OptionalHint messages={this.props.messages}/>}
      </FormGroup>
    );
  }
}

const OptionalHint = props => (
  <div className="passwordOptionalHint">
    <img src={OptionalHintIcon} alt={props.messages.password_optional_hint_title}/>
    <div className="passwordOptionalHintPopup">
      <div className="passwordOptionalHintHeader">
        {props.messages.password_optional_hint_title}
      </div>
      <div className="passwordOptionalHintMessage">
        {props.messages.password_optional_hint_message}
      </div>
    </div>
  </div>
);

PasswordComponent.propTypes = {
  id: PropTypes.any.isRequired,
  passwordLink: PropTypes.instanceOf(ValueLink).isRequired,
  showOptionalHint: PropTypes.bool,
};

export default PasswordComponent;
