/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2017 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React, { Component } from 'react';
import { Button, Form, FormGroup, Label } from 'reactstrap';
import PropTypes from 'prop-types';

import { Checkbox, TextInput, UrlInput } from '../form/Inputs';

import './Setup.css';

class SetupComponent extends Component {
  constructor(props) {
    super(props);
    this.logger = props.logger;
    this.logger.debug('HeaderComponent props', props);
  }

  render() {
    const sdkApiKeyLink = this.props.valueLinks.sdkApiKey;
    const baseUrlLink = this.props.valueLinks.baseUrl;
    const mutualAuthEnabledLink = this.props.valueLinks.mutualAuthEnabled;
    return (
      <div id="configuration">
        <div id='configurationForm' className="configurationForm">
          <Form>
            <FormGroup>
              <div id='configurationHeader' className="configurationHeader" />
              <div id='configurationIntro' className="configurationIntro formSpacing">
                <div id='configurationTitle' className="configurationTitle">{this.props.messages.setup}</div>
                <div id='configurationMessage' className="configurationMessage">{this.props.messages.setup_message}</div>
              </div>
              <div className='formSpacing'>
                <Label for="sdkApiKey">{this.props.messages.setup_sdkApiKey_label}</Label>
                <TextInput name="sdkApiKey" id="sdkApiKey"
                  placeholder={this.props.messages.setup_sdkApiKey_prompt}
                  valueLink={sdkApiKeyLink} />
              </div>
              <div className='formSpacing'>
                <Label for="baseUrl">{this.props.messages.setup_baseurl_label}</Label>
                <UrlInput name="baseUrl" id="baseUrl"
                  placeholder={this.props.messages.setup_baseurl_prompt}
                  valueLink={baseUrlLink} />
              </div>
              <div className='formSpacing'>
                <Checkbox className="mutualAuthEnabled" id="mutualAuthEnabled" name="mutualAuthEnabled" checkedLink={mutualAuthEnabledLink}>
                  {this.props.messages.setup_enable_mutual_auth}
                </Checkbox>
              </div>
              <div className="formSubmit">
                <Button color="success" id="submit" onClick={this.props.submitSetup}>{this.props.messages.continue}</Button>
              </div>
            </FormGroup>
          </Form>
        </div>
      </div>
    );
  }
}

SetupComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  submitSetup: PropTypes.func.isRequired,
  logger: PropTypes.object.isRequired,
  valueLinks: PropTypes.object.isRequired,
};

export default SetupComponent;
