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
import * as React from 'react';

import { FormGroup, Input, Label } from 'reactstrap';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import './Inputs.css';

const setValue = (x, e) => e.target.value;
function validationClasses(props, value, error) {
  const classNames = props.className ? [props.className] : [];
  if (error) {
    classNames.push(props.invalidClass || 'errorInput');
    if (value === '') {
      classNames.push(props.requiredClass || 'required');
    }
  }
  return classNames.join(' ');
}
function monthValidationClasses(props, value, error) {
  const classNames = props.className ? [`${props.className}Month`] : ['dateInputMonth'];
  if (error) {
    classNames.push(props.invalidClass || 'errorInput');
    if (value === '') {
      classNames.push(props.requiredClass || 'required');
    }
  }
  return classNames.join(' ');
}
function dayValidationClasses(props, value, error) {
  const classNames = props.className ? [`${props.className}Day`] : ['dateInputDay'];
  if (error) {
    classNames.push(props.invalidClass || 'errorInput');
    if (value === '') {
      classNames.push(props.requiredClass || 'required');
    }
  }
  return classNames.join(' ');
}
function yearValidationClasses(props, value, error) {
  const classNames = props.className ? [`${props.className}Year`] : ['dateInputYear'];
  if (error) {
    classNames.push(props.invalidClass || 'errorInput');
    if (value === '') {
      classNames.push(props.requiredClass || 'required');
    }
  }
  return classNames.join(' ');
}

export class NumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyPress = (e) => {
      const { charCode } = e;
      const { integer, positive } = this.props;
      // if positive do not allow charCode 45 which is '-'
      // if integer do not allow charCode 46 which is '.'
      const allowed = (positive ? [] : [45]).concat(integer ? [] : [46]);
      if (e.ctrlKey) {
        return;
      }
      if (charCode && // allow control characters
        (charCode < 48 || charCode > 57) && // char is number
        allowed.indexOf(charCode) < 0) {
        e.preventDefault();
      }
    };
    this.onChange = (e) => {
      // Update local state...
      const { value } = e.target;
      this.setValue(value);
      const asNumber = Number(value);
      const isEmpty = '' === value;
      if ((isEmpty || value) && !isNaN(asNumber)) {
        this.props.valueLink.update((x) => {
          // Update link if value is changed
          // return empty string when the input is empty; otherwise return the input's numerical value.
          if (isEmpty){
            return '';
          }
          return asNumber;
        });
      }
    };
  }
  UNSAFE_componentWillMount() {
    // Initialize component state
    this.setAndConvert(this.props.valueLink.value);
  }
  setValue(x) {
    // We're not using native state in order to avoid race condition.
    this.value = String(x);
    this.error = this.value !== '' && isNaN(Number(x));
    this.forceUpdate();
  }
  setAndConvert(x) {
    let value = x;
    if (value !== '') {
      value = Number(x);
      if (this.props.positive) {
        value = Math.abs(x);
      }
      if (this.props.integer) {
        value = Math.round(value);
      }
    }
    this.setValue(value);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { valueLink: next } = nextProps;
    if (Number(next.value) !== Number(this.value)) {
      this.setAndConvert(next.value); // keep state being synced
    }
  }
  render() {
    const { valueLink, positive, integer, shouldDisplayError, ...props } = this.props;
    const error = valueLink.error || this.error;
    return (
      <div className={`${props.className}Wrapper`}>
        <Input {...props} type="text"
          className={validationClasses(props, this.value, error)}
          value={this.value ? this.value : ''}
          onKeyPress={this.onKeyPress} onChange={this.onChange}/>
        { error && shouldDisplayError &&
            <div className='error' dangerouslySetInnerHTML={{ __html: error }}/>
        }
      </div>
    );
  }
}

export const TextInput = ({ valueLink, invalidClass, requiredClass, ...props }) => {
  let actionCallback = setValue;
  if (valueLink.setValue && typeof valueLink.setValue === 'function') {
    actionCallback = valueLink.setValue;
  }
  return (
    <FormGroup>
      <Input {...props}
        type="text"
        className={validationClasses({ invalidClass, requiredClass, ...props }, valueLink.value, valueLink.error)}
        value={valueLink.value ? valueLink.value : ''}
        onChange={valueLink.action(actionCallback)}/>
      { valueLink.error &&
        <div className='error'>{valueLink.error}</div>
      }
    </FormGroup>
  );
};

export const PhoneNumberInput = ({ valueLink, invalidClass, requiredClass, ...props }) => {
  let country=props.locale.split('_')[1];
  const setValue = ( x, e ) => e ? e : '';
  return (
    <FormGroup>
      <PhoneInput {...props} country={country} defaultCountry={country}
        className={validationClasses({ invalidClass, requiredClass, ...props }, valueLink.value, valueLink.error)}
        value={valueLink.value ? valueLink.value : ''}
        onChange={valueLink.action(setValue)}/>
      { valueLink.error &&
        <div className='error'>{valueLink.error}</div>
      }
    </FormGroup>
  );
};

export const UrlInput = ({ valueLink, invalidClass, requiredClass, ...props }) => (
  <FormGroup>
    <Input {...props}
      type="url"
      className={validationClasses({ invalidClass, requiredClass, ...props }, valueLink.value, valueLink.error)}
      value={valueLink.value ? valueLink.value : ''}
      onChange={valueLink.action(setValue)}/>
    { valueLink.error &&
      <div className='error'>{valueLink.error}</div>
    }
  </FormGroup>
);

export const TextInputRaw = ({ valueLink, invalidClass, requiredClass, ...props }) => (
  <Input {...props}
    type="text"
    title={valueLink.value ? valueLink.value : ''}
    className={validationClasses({ invalidClass, requiredClass, ...props }, valueLink.value, valueLink.error)}
    value={valueLink.value ? valueLink.value : ''}
    onChange={valueLink.action(setValue)}/>
);

export const EmailInput = ({ valueLink, invalidClass, requiredClass, ...props }) => (
  <FormGroup>
    <Input {...props}
      type="email"
      className={validationClasses({ invalidClass, requiredClass, ...props }, valueLink.value, valueLink.error)}
      value={valueLink.value}
      onChange={valueLink.action(setValue)}/>
    { valueLink.error &&
      <div className='error'>{valueLink.error}</div>
    }
  </FormGroup>
);

export const PasswordInput = ({ valueLink, invalidClass, requiredClass, ...props }) => (
  <FormGroup>
    <Input {...props}
      type="password"
      className={validationClasses({ invalidClass, requiredClass, ...props }, valueLink.value, valueLink.error)}
      value={valueLink.value ? valueLink.value : ''}
      onChange={valueLink.action(setValue)}/>
    { valueLink.error &&
      <div className='error'>{valueLink.error}</div>
    }
  </FormGroup>
);

export const Select = ({ valueLink, children, invalidClass, requiredClass, ...props }) => (
  <Input {...props}
    type="select"
    required
    className={validationClasses({ invalidClass, requiredClass, ...props }, valueLink.value, valueLink.error)}
    value={valueLink.value} onChange={valueLink.action(setValue)}>
    {children}
  </Input>
);

export const Radio = ({ className, invalidClass, requiredClass, checkedLink, value = 'on', children, ...props }) => (
  <FormGroup check className={className}>
    <Label check>
      <Input type="radio" value={value} checked={checkedLink.value === value} onChange={checkedLink.action(setValue)} {...props}/>
      {children}
    </Label>
  </FormGroup>
);

export const Checkbox = ({ className, checkedLink, children, ...props }) => (
  <FormGroup check className={className}>
    <Label check>
      <Input type="checkbox" checked={checkedLink.checked || checkedLink.value === true} onChange={checkedLink.action(x => !x)} {...props}/>
      {children}
    </Label>
    { checkedLink.error &&
      <div className='error'>{checkedLink.error}</div>
    }
  </FormGroup>
);

export const GenderInput = ({ className, genderLink, genderIdentityLink, tabIndex, ...props }) => (
  <FormGroup key="genderIdentification" className={className}>
    <div className='gender-wrapper'>
      {props.genderSupportEnabled &&
        <div className='gender-block'>
          <div className="selectTitle" id="genderIdentityTitle">{props.messages.gender_title}</div>
          <Select id="genderIdentity" name="genderIdentity" valueLink={genderIdentityLink} requiredClass='errorInput' disabled={props.disabled} tabIndex={tabIndex}>
            <option key='emptyGender' value='' disabled hidden>{props.messages.gender_title}</option>
            {props.supportedGenderIdentities &&
            props.supportedGenderIdentities.map(gi => <option key={gi.key} value={gi.key} selected={genderIdentityLink && genderIdentityLink.value === gi.key}>{gi.genderText}</option>)}
          </Select>
          { genderIdentityLink.error &&
            <div className='error'>{genderIdentityLink.error}</div>
          }
        </div>
      }
      <div className='gender-block'>
        <div className="selectTitle" id="genderTitle">{props.genderSupportEnabled ? props.messages.biologicalSex_title : props.messages.gender_title}</div>
        <Select id="gender" name="gender" valueLink={genderLink} requiredClass='errorInput' disabled={props.disabled} tabIndex={tabIndex + 1}>
          <option key='emptyBiologicalSex' value='' disabled hidden>{props.genderSupportEnabled ? props.messages.biologicalSex_title : props.messages.gender_title}</option>
          <option key='female' value='F'>{props.messages.female}</option>
          <option key='male' value='M'>{props.messages.male}</option>
          {props.genderSupportEnabled &&
            <option key='unknown' value='U'>{props.messages.unknown}</option>
          }
        </Select>
        { genderLink.error &&
          <div className='error'>{genderLink.error}</div>
        }
      </div>
    </div>
  </FormGroup>
);

export const DateInput = ({ tabIndex, id, valueLink, className, invalidClass, requiredClass, ...props }) => (
  <FormGroup className={className}>
    <div className={`${className}InputGroup`}>
      <Select tabIndex={tabIndex} className={monthValidationClasses({ className, invalidClass, requiredClass, ...props }, valueLink.value, valueLink.error)} id={`${id}Month`} name="month" disabled={props.disabled} valueLink={valueLink.at('month')}>
        <option value='' disabled hidden>{props.messages.month}</option>
        <option value='1'>{props.messages.month_01}</option>
        <option value='2'>{props.messages.month_02}</option>
        <option value='3'>{props.messages.month_03}</option>
        <option value='4'>{props.messages.month_04}</option>
        <option value='5'>{props.messages.month_05}</option>
        <option value='6'>{props.messages.month_06}</option>
        <option value='7'>{props.messages.month_07}</option>
        <option value='8'>{props.messages.month_08}</option>
        <option value='9'>{props.messages.month_09}</option>
        <option value='10'>{props.messages.month_10}</option>
        <option value='11'>{props.messages.month_11}</option>
        <option value='12'>{props.messages.month_12}</option>
      </Select>
      <NumberInput tabIndex={1 + Number(tabIndex)} className={dayValidationClasses({ className, invalidClass, requiredClass, ...props }, valueLink.value, valueLink.error)} id={`${id}Day`} name="day" valueLink={valueLink.at('day')} disabled={props.disabled} placeholder={props.messages.day} positive integer maxLength="2"/>
      <NumberInput tabIndex={2 + Number(tabIndex)} className={yearValidationClasses({ className, invalidClass, requiredClass, ...props }, valueLink.value, valueLink.error)} id={`${id}Year`} name="year" valueLink={valueLink.at('year')} disabled={props.disabled} placeholder={props.messages.year} positive integer maxLength="4" />
    </div>
    { valueLink.error &&
      <div className='error'>{valueLink.error}</div>
    }
  </FormGroup>
);
