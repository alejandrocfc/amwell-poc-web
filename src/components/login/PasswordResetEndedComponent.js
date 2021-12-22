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
import { FormattedMessage } from 'react-intl';
import { Form, Button } from 'reactstrap';
import PropTypes from 'prop-types';

class PasswordResetEndedComponent extends React.Component {
  render() {
    return (
      <div>
        <div id="login" className="loginAssistanceContainer">
          <div className='loginAssistanceForm'>
            <div className='blueFormHeader'>{this.props.messages.login_assistance_help}</div>
            <Form className='formGroupContent'>
              {sessionStorage.getItem('resetComplete') === 'true' ?
                (
                  <div>
                    <div className="loginAssistanceText">{this.props.messages.success}</div>
                    <div className="loginAssistanceSubtext">{this.props.messages.login_assistance_password_complete_subtext}</div>
                  </div>
                ) : (
                  <div>
                    <div className="loginAssistanceText">{this.props.messages.login_assistance_link_invalid}</div>
                    <div className="loginAssistanceSubtext"><FormattedMessage id="login_assistance_password_reset_failed" values={ { formattedNumber: this.props.customer_support_phone_number } } /></div>
                  </div>
                )
              }
              <div className="continueButton">
                <Button color="success" id="ok" onClick={() => this.props.history.push('/')}>
                  {this.props.messages.ok}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

PasswordResetEndedComponent.propTypes = {
  messages: PropTypes.any.isRequired,
};

export default PasswordResetEndedComponent;
