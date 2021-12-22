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

import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { TextInput } from '../form/Inputs';
import GenericModal from '../popups/info/GenericModal';

import './ServicesComponent.css';


class ServicesComponent extends React.Component {
  render() {
    let row = 0;
    let serviceCt = 0;
    const servicesGrid = [];
    let serviceCells = [];

    this.props.practices.forEach((practice) => {
      serviceCt += 1;
      serviceCells.push(
        <Col key={serviceCt} className="serviceCell" onClick={e => this.props.handlePracticeClick(e, practice) }>
          <div className="practiceLogo">{practice.hasSmallLogo ? <img id={ `logo_${practice.name.split(/\s+/).join('_').toLowerCase()}`} alt={practice.name} src={practice.smallLogoUrl}/> : <span id={`logo_${practice.name.split(/\s+/).join('_').toLowerCase()}`} className="practiceName">{practice.name}</span>}</div>
        </Col>);
      if (serviceCt % 3 === 0) {
        row += 1;
        servicesGrid.push(<Row key={row}>{serviceCells}</Row>);
        serviceCells = [];
      }
    });

    if (serviceCells.length !== 0) servicesGrid.push(<Row key={serviceCt}>{serviceCells}</Row>);

    return (
      <div className="App">
        <div className="servicesComponent">
          <div className="servicesHeader"></div>
          <div className="servicesBody">
            <div className="servicesGrid">
              <span className="servicesTitle">{this.props.messages.services_my_services}</span>
              {this.props.sdk.getSystemConfiguration().serviceKeyCollected && <span className="addAServiceKeyLink" onClick={() => this.props.toggleServiceKeyModal()}>{this.props.messages.services_add_a_service_key}</span>}
              <Container>
                {servicesGrid}
              </Container>

              <GenericModal
                className="addServiceKeyModal"
                isOpen={this.props.showAddServiceKeyModal}
                showClose={true}
                message={
                  <div>
                    <span>{this.props.messages.services_add_a_service_key_description}</span>
                    <TextInput className="addServiceKeyInput" valueLink={this.props.valueLinks.newServiceKey} placeholder={this.props.messages.services_enter_service_key}/>
                  </div>
                }
                header={this.props.messages.services_add_a_service_key.toUpperCase()}
                toggle={this.props.toggleServiceKeyModal}>
                <button onClick={() => this.props.toggleServiceKeyModal()}>{this.props.messages.services_cancel}</button>
                <button onClick={() => this.props.addServiceKey()}>{this.props.messages.services_add}</button>
              </GenericModal>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ServicesComponent.propTypes = {
  history: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  practices: PropTypes.array.isRequired,
  logger: PropTypes.object.isRequired,
};
ServicesComponent.defaultProps = {};
export default ServicesComponent;
