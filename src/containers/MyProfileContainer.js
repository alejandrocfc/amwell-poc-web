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
import { NavLink, Route, Switch } from 'react-router-dom';
import MyProfileAccount from './MyProfileAccountContainer';
import MyProfilePharmacyContainer from './MyProfilePharmacyContainer';
import MyProfileVisitsContainer from './MyProfileVisitsContainer';
import MyProfileDependentsContainer from './MyProfileDependentsContainer';
import PageComponent from '../components/layout/PageComponent';
import banner from '../components/images/banners/woman-at-computer.png';
import MyProfileInsuranceContainer from './MyProfileInsuranceContainer';

class MyProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyProfileContainer: props', props);
  }

  render() {
    return (
      <PageComponent banner={banner}>
        <div className="myProfileTitle">{this.props.messages.my_profile}</div>
        <div className="myProfileContainer">
          <div className="myProfileMenuContainer">
            <div className="myProfileMenu">
              <NavLink className="myProfileMenuItem" activeClassName="selected" to='/myprofile/account'>{this.props.messages.account2}</NavLink>
              <NavLink className="myProfileMenuItem" activeClassName="selected" to='/myprofile/insurance'>{this.props.messages.insurance}</NavLink>
              <NavLink className="myProfileMenuItem" activeClassName="selected" to='/myprofile/pharmacy'>{this.props.messages.pharmacy}</NavLink>
              <NavLink className="myProfileMenuItem" activeClassName="selected" to='/myprofile/visits'>{this.props.messages.previous_visits}</NavLink>
              {!this.props.isDependent && <NavLink className="myProfileMenuItem" activeClassName="selected" to='/myprofile/dependents'>{this.props.messages.my_children}</NavLink>}
            </div>
          </div>
          <Switch>
            <Route path='/myprofile/account'>
              <MyProfileAccount {...this.props}/>
            </Route>
            <Route path='/myprofile/insurance'>
              <MyProfileInsuranceContainer {...this.props}/>
            </Route>
            <Route path='/myprofile/pharmacy'>
              <MyProfilePharmacyContainer {...this.props}/>
            </Route>
            <Route path='/myprofile/visits'>
              <MyProfileVisitsContainer {...this.props}/>
            </Route>
            <Route path='/myprofile/dependents'>
              <MyProfileDependentsContainer {...this.props}/>
            </Route>
          </Switch>
        </div>
      </PageComponent>
    );
  }
}

MyProfileContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired
};
MyProfileContainer.defaultProps = {};
export default MyProfileContainer;
