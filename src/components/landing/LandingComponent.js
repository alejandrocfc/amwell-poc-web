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
import { Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import './LandingComponent.css';

import physiciansIcon from './images/iconPhysicians.png';
import pharmacyIcon from './images/iconPharmacy.png';
import telehealthIcon from './images/iconTelehealth.png';
import myLifeIcon from './images/iconMyLife.png';

class LandingComponent extends React.Component {
  constructor(props) {
    super(props);
    this.sdk = props.sdk;
    this.messages = props.messages;
  }

  render() {
    return (
      <div className="App">
        <div className="landingComponent">
          <div className="landingHeader"></div>
          <div className="landingBody">
            <div className="landingServices">
              <Container>
                <Row>
                  <Col className="serviceImage serviceTelehealth" onClick={this.props.gotoServices}><div><img src={telehealthIcon} alt={this.messages.landing_telehealth}/></div><div>{this.messages.landing_telehealth}</div></Col>
                  <Col className="serviceImage servicePharmacy"><div><img src={pharmacyIcon} alt={this.messages.landing_pharmacy}/></div><div>{this.messages.landing_pharmacy}</div></Col>
                </Row>
                <Row>
                  <Col className="serviceImage servicePhysicians"><div><img src={physiciansIcon} alt={this.messages.landing_physicians}/></div><div>{this.messages.landing_physicians}</div></Col>
                  <Col className="serviceImage serviceMyLife"><div><img src={myLifeIcon} alt={this.messages.landing_my_life}/></div><div>{this.messages.landing_my_life}</div></Col>
                </Row>
              </Container>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LandingComponent.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  gotoServices: PropTypes.func.isRequired,
};

LandingComponent.defaultProps = {};
export default LandingComponent;
