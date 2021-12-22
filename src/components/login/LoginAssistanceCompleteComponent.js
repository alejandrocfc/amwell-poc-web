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

class LoginAssistanceCompleteComponent extends React.Component {
  render() {
    const concludingText = this.props.isPasswordFlow ? this.props.messages.login_assistance_password_conclusion : this.props.messages.login_assistance_username_conclusion;

    return (
      <div>
        <div className="loginAssistanceContainer">
          <Form className="formGroupContent">
            {this.props.redactedEmail &&
            <div>
              <div className="loginAssistanceText">
                <FormattedMessage id="login_assistance_username_recovered" values={ { redactedEmail: this.props.redactedEmail } } />
              </div>
              <div className="loginAssistanceSubtext">
                <FormattedMessage id="login_assistance_further_assistance" values={ { formattedNumber: this.props.messages.customer_support_phone_number } } />
              </div>
            </div>
            }
            {!this.props.redactedEmail &&
            <div>
              <div className="loginAssistanceText">{concludingText}</div>
              <div className="loginAssistanceSubtext">
                <FormattedMessage id="login_assistance_didnt_receive_email" values={ { formattedNumber: this.props.messages.customer_support_phone_number } } />
              </div>
            </div>
            }
            <div className="continueButton okButton">
              <Button color="success" id="ok" onClick={() => this.props.history.push('/')}>
                {this.props.messages.ok}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

LoginAssistanceCompleteComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  isPasswordFlow: PropTypes.bool.isRequired,
  redactedEmail: PropTypes.string,
};

export default LoginAssistanceCompleteComponent;
