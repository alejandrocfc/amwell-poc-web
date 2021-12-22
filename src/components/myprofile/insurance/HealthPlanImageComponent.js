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

import ViewHealthPlanImageIcon from '../images/icon-help-insurance.png';
import CloseHealthPlanImageIcon from '../images/icon-close.png';
import '../MyProfileComponent.css';

class HealthPlanImageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.knownImageUrls = {};
    this.state = {
      healthPlanSrc: null,
    };
  }

  getHealthPlanImage(healthPlan) {
    if (healthPlan) {
      const cachedUrl = this.knownImageUrls[healthPlan.name];
      if (cachedUrl) {
        if (cachedUrl !== 'None' && this.state.healthPlanSrc !== cachedUrl) {
          // we've cached an image URL and the current state needs to reflect it
          this.setState({ healthPlanSrc: cachedUrl });
        } else if (cachedUrl === 'None' && this.state.healthPlanSrc !== null) {
          // no image exists for this health plan, and current state needs to reflect it
          this.setState({ healthPlanSrc: null });
        }
      } else {
        // we've yet to cache an image, see if we can find one
        this.fetchHealthPlanImage(healthPlan);
      }
    }
  }

  fetchHealthPlanImage(healthPlan) {
    this.props.sdk.consumerService.getHealthPlanCardImage(this.props.currentConsumer, healthPlan).then((blob) => {
      // we found an image for this health plan, let's cache it and update state
      const healthPlanSrc = window.URL.createObjectURL(blob);
      this.knownImageUrls[healthPlan.name] = healthPlanSrc;
      this.setState({ healthPlanSrc });
    }).catch(() => {
      // no image exists for this health plan, let's cache this fact and nullify state
      this.knownImageUrls[healthPlan.name] = 'None';
      this.setState({ healthPlanSrc: null });
    });
  }

  componentWillUnmount() {
    const keys = Object.keys(this.knownImageUrls);
    keys.forEach((key) => {
      const imageUrl = this.knownImageUrls[key];
      window.URL.revokeObjectURL(imageUrl);
    });
  }

  componentDidMount() {
    this.getHealthPlanImage(this.props.healthPlan);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.getHealthPlanImage(nextProps.healthPlan);
  }

  toggleShowImage(e) {
    if (e) e.preventDefault();
    this.setState(prevState => ({
      showImage: !prevState.showImage,
    }));
  }

  render() {
    return (
      <div>
        { this.state.healthPlanSrc &&
          <div className="healthPlanImageToggle" onClick={ e => this.toggleShowImage(e)}>
            <img alt="" src={!this.state.showImage ? ViewHealthPlanImageIcon : CloseHealthPlanImageIcon}/>
          </div>
        }
        { this.state.showImage &&
          <img className="healthPlanCardImage" src={this.state.healthPlanSrc} alt=''/>
        }
      </div>
    );
  }
}

HealthPlanImageComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
HealthPlanImageComponent.defaultProps = {};
export default HealthPlanImageComponent;
