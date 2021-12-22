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

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Route, Switch } from 'react-router-dom';
import MyHealthAllergiesContainer from './MyHealthAllergiesContainer';
import MyHealthMedicationsContainer from './MyHealthMedicationsContainer';
import MyHealthMeasurementsContainer from './MyHealthMeasurementsContainer';
import MyHealthVitalsContainer from './MyHealthVitalsContainer';
import MyHealthHistoryContainer from './MyHealthHistoryContainer';
import PageComponent from '../components/layout/PageComponent';
import banner from '../components/images/banners/hiking-sunset.png';

class MyHealthContainer extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyHealthContainer: props', props);
  }
  
  render() {
    return (
      <PageComponent banner={banner}>
        <div className="myHealthTitle">{this.props.messages.my_health}</div>
        <div className="myHealthContainer">
          <div className="myHealthMenuContainer">
            <div className="myHealthMenu">
              <NavLink className="myHealthMenuItem" activeClassName="selected" to='/myhealth/history'>{this.props.messages.medical_history}</NavLink>
              <NavLink className="myHealthMenuItem" activeClassName="selected" to='/myhealth/allergies'>{this.props.messages.allergies}</NavLink>
              <NavLink className="myHealthMenuItem" activeClassName="selected" to='/myhealth/medications'>{this.props.messages.medications}</NavLink>
              <NavLink className="myHealthMenuItem" activeClassName="selected" to='/myhealth/measurements'>{this.props.messages.measurements}</NavLink>
              <NavLink className="myHealthMenuItem" activeClassName="selected" to='/myhealth/vitals'>{this.props.messages.vitals}</NavLink>
            </div>
          </div>
          <Switch>
            <Route path='/myhealth/history'>
              <MyHealthHistoryContainer {...this.props}/>
            </Route>
            <Route path='/myhealth/allergies'>
              <MyHealthAllergiesContainer {...this.props}/>
            </Route>
            <Route path='/myhealth/medications'>
              <MyHealthMedicationsContainer {...this.props}/>
            </Route>
            <Route path='/myhealth/measurements'>
              <MyHealthMeasurementsContainer {...this.props}/>
            </Route>
            <Route path='/myhealth/vitals'>
              <MyHealthVitalsContainer {...this.props}/>
            </Route>
          </Switch>
        </div>
      </PageComponent>
    );
  }
}

MyHealthContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired
};
MyHealthContainer.defaultProps = {};
export default MyHealthContainer;
