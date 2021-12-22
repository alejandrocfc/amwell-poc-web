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
import { Container, Row, Col } from 'reactstrap';

import './ProviderInformationComponent.css';


class ProviderInformationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('ProviderInformationComponent: props', props);
    this.buildTextFromList = this.buildTextFromList.bind(this);
  }

  buildTextFromList(list) {
    if (list && list.length > 0) {
      const text = [];
      list.forEach((item, index) => {
        const value = item.value || item;
        text.push(index === 0 ? value : `, ${value}`);
      });
      return text;
    }
    return this.props.messages.provider_none;
  }

  render() {
    return (
      <Container className="providerInformationComponent">
        <Row>
          <Col className="section">
            <div className="title">{this.props.messages.provider_languages}:</div>
            <div>{this.buildTextFromList(this.props.providerDetails.spokenLanguages)}</div>
          </Col>
          <Col className="section">
            <div className="title">{this.props.messages.provider_education}:</div>
            <div>{this.props.providerDetails.schoolName}, {this.props.providerDetails.graduatingYear}</div>
          </Col>
        </Row>
        <Row>
          <Col className="section">
            <div className="title">{this.props.messages.provider_experience}:</div>
            <div>{this.props.providerDetails.yearsExperience}</div>
          </Col>
          <Col className="section">
            <div className="title">{this.props.messages.provider_certification}:</div>
            <div>{this.buildTextFromList(this.props.providerDetails.boardCertificates)}</div>
          </Col>
        </Row>
        <Row>
          <Col className="section">
            <div className="title">{this.props.messages.provider_licensed_states}:</div>
            <div>{this.buildTextFromList(this.props.providerDetails.statesLicensedIn)}</div>
          </Col>
        </Row>
      </Container>);
  }
}


ProviderInformationComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  providerDetails: PropTypes.object.isRequired,
};
ProviderInformationComponent.defaultProps = {};
export default ProviderInformationComponent;
