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
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import SummaryRecipient from './SummaryRecipient';
import { isValidPhoneNumber, isValidEmail } from '../Util';

import './VisitShareSummaryComponent.css';
import InformationModal from '../popups/info/InformationModal';

class VisitShareSummaryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHipaaModal: false,
    };
  }

  toggleHipaaModal(e) {
    if (e) e.preventDefault();
    this.setState(prevState => ({
      showHipaaModal: !prevState.showHipaaModal,
    }));
  }

  render() {
    const emailsSelected = this.props.emailAddresses && this.props.emailAddresses.find(e => e.isSelected);
    const faxesSelected = this.props.faxNumbers && this.props.faxNumbers.find(f => f.isSelected);

    return (
      <div className="visitSummaryShare">
        {this.props.showSendVisitSummary &&
        <div>
          <h1>{this.props.messages.visit_summary_share_email}</h1>
          <SummaryRecipientsList
            validator={isValidEmail}
            invalidFields={this.props.invalidFields}
            updateSummaryRecipients={this.props.setEmailAddresses}
            summaryRecipients={this.props.emailAddresses}
            placeholder={this.props.messages.visit_summary_email_input_placeholder_text}
            invalidText={this.props.messages.visit_summary_email_input_invalid}
            addNewText={this.props.messages.visit_summary_add_email}/>
        </div>}
        {this.props.electronicFaxEnabled &&
        <div>
          <h1>{this.props.messages.visit_summary_share_fax}</h1>
          <SummaryRecipientsList
            validator={isValidPhoneNumber}
            invalidFields={this.props.invalidFields}
            updateSummaryRecipients={this.props.setFaxNumbers}
            summaryRecipients={this.props.faxNumbers}
            placeholder={this.props.messages.visit_summary_fax_input_placeholder_text}
            invalidText={this.props.messages.visit_summary_fax_input_invalid}
            addNewText={this.props.messages.visit_summary_add_fax}/>
        </div>}

        {(emailsSelected || faxesSelected) &&
        <div>
          <label className='visitSummaryHipaa'>
            <input type="checkbox" id="visitSummaryAcceptHipaa" checked={this.props.hipaaAccepted} onChange={e => this.props.setHipaaAccepted(e.target.checked)}/>
            <FormattedMessage id="hipaaReleases" defaultMessage={ this.props.messages.visit_summary_hipaa_accept_text }
              values={{ hipaaReleases: <button className="link-like" title={this.props.visitSummary.hipaaNoticeText} onClick={e => this.toggleHipaaModal(e)}>{ this.props.messages.visit_summary_hipaa_releases }</button> }} />
          </label>
          {this.props.showHipaaError &&
          <div className='visitSummaryHipaaError'>{this.props.messages.visit_summary_hipaa_accept_text_error_email_or_fax}</div>}
        </div>}

        <InformationModal
          isOpen={this.state.showHipaaModal}
          messages={this.props.messages}
          message={
            <div>
              <p>
                {this.props.visitSummary.hipaaNoticeText}
              </p>
              <p>
                {this.props.visitSummary.additionalHipaaNoticeText}
              </p>
            </div>}
          header={this.props.messages.visit_summary_hipaa_releases}
          toggle={this.toggleHipaaModal.bind(this)}
          buttonText={this.props.messages.close}/>
      </div>);
  }
}

VisitShareSummaryComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  emailAddresses: PropTypes.array.isRequired,
  faxNumbers: PropTypes.array.isRequired,
  hipaaAccepted: PropTypes.bool.isRequired,
  showHipaaError: PropTypes.bool.isRequired,
  setHipaaAccepted: PropTypes.func.isRequired,
  setFaxNumbers: PropTypes.func.isRequired,
  setEmailAddresses: PropTypes.func.isRequired,
};


class SummaryRecipientsList extends React.Component {
  handleAddNew(event) {
    event.preventDefault();
    this.props.updateSummaryRecipients([...this.props.summaryRecipients, new SummaryRecipient('')]);
  }

  handleChange(event, index) {
    const summaryRecipients = [...this.props.summaryRecipients];
    const summaryRecipient = summaryRecipients[index];

    // auto-check when text is added, otherwise just set value of checkbox
    if (event.target.type === 'text') {
      summaryRecipient.value = event.target.value;
      summaryRecipient.isSelected = !!event.target.value;
      summaryRecipient.hasError = false;
    } else {
      summaryRecipient.isSelected = event.target.checked;
    }

    this.props.updateSummaryRecipients(summaryRecipients);
  }

  render() {
    return (
      <div>
        {this.props.summaryRecipients.map((summaryRecipient, index) =>
          <CheckableInput
            key={`recipient${index}`}
            invalidText={this.props.invalidText}
            placeholder={this.props.placeholder}
            summaryRecipient={summaryRecipient}
            onChange={e => this.handleChange(e, index)}
          />)}
        <button className="link-like" onClick={e => this.handleAddNew(e)}>{this.props.addNewText}</button>
      </div>
    );
  }
}

SummaryRecipientsList.propTypes = {
  invalidFields: PropTypes.array,
  placeholder: PropTypes.string.isRequired,
  addNewText: PropTypes.string.isRequired,
  invalidText: PropTypes.string.isRequired,
  summaryRecipients: PropTypes.array.isRequired,
  updateSummaryRecipients: PropTypes.func.isRequired,
  validator: PropTypes.func.isRequired,
};


class CheckableInput extends React.Component {
  render() {
    const className = classNames({
      checkableInput: true,
      hasError: this.props.summaryRecipient.hasError,
    });
    return (
      <div className={className}>
        <input type='checkbox'
          checked={this.props.summaryRecipient.isSelected}
          onChange={this.props.onChange}/>
        <div className='checkableInputTextAndError'>
          <input type='text'
            placeholder={this.props.placeholder}
            value={this.props.summaryRecipient.value}
            onChange={this.props.onChange}/>
          {this.props.summaryRecipient.hasError &&
          <span>
            {this.props.invalidText}
          </span>}
        </div>
      </div>
    );
  }
}

CheckableInput.propTypes = {
  invalidText: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  summaryRecipient: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default VisitShareSummaryComponent;
