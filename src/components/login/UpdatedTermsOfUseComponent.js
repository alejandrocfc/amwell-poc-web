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
import { Button, Form } from 'reactstrap';
import { Link } from 'react-router-dom';

import { Checkbox } from '../form/Inputs';

import './UpdatedTermsOfUse.css';

class UpdatedTermsOfUseComponent extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="updatedTermsOfUse">
          <div className="updatedTermsOfUseHeader">
            <div className="updatedTermsOfUseHeaderIcon"></div>
            <div className="updatedTermsOfUseHeaderTitle">{this.props.messages.updated_terms_of_use}</div>
          </div>
          <Form className="updatedTermsOfUseForm">
            <div className="updatedTermsOfUseDesc">{this.props.messages.updated_terms_of_use_desc}</div>
            <div className="updatedTermOfUseBody">
              <div className="disclaimerTextBox">
                <div dangerouslySetInnerHTML={{ __html: this.props.outstandingDisclaimer.legalText }} />
              </div>
              <Checkbox className="TOU" id="updatedTOU" name="hasAcceptedDisclaimer" checkedLink={this.props.hasAcceptedDisclaimerLink}>
                <div className="TOUInputText">{ this.props.messages.updated_terms_of_use_agree }</div>
              </Checkbox>
            </div>
            <div id="updatedTermsOfUseSubmit" className="updatedTermsOfUseSubmit">
              <Button id="submit" className="updatedTermsOfUseButton" onClick={e => this.props.submitAgreeToTerms(e)}>{this.props.messages.continue}</Button>
            </div>
            <div id="updatedTermsOfUseCancel" className="updatedTermsOfUseCancel">
              <Link to={'/'}>{this.props.messages.cancel}</Link>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

UpdatedTermsOfUseComponent.propTypes = {
  outstandingDisclaimer: PropTypes.any,
  hasAcceptedDisclaimerLink: PropTypes.any,
  submitAgreeToTerms: PropTypes.func.isRequired,
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
UpdatedTermsOfUseComponent.defaultProps = {};
export default UpdatedTermsOfUseComponent;
