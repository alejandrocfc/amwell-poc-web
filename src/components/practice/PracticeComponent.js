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
import { Route } from 'react-router-dom';

import StartFirstAvailableSearchComponent from '../firstAvailable/StartFirstAvailableSearchComponent';
import ProviderGrid from '../provider/providergrid/ProviderGridComponent';
import WelcomeMessage from './WelcomeMessageComponent';
import ScheduleAppointmentContainer from '../../containers/ScheduleAppointmentContainer';
import Tab from '../tabs/TabComponent';
import TabBar from '../tabs/TabBarComponent';

import './PracticeComponent.css';

const PracticeComponent = (props) => {
  props.logger.debug('PracticeComponent: props', props);

  return (
    <div className="App">
      <div className="practiceComponent">
        <div className="practiceHeader">
          <div className="practiceDetails">
            <div className="practiceLogo">{props.practice.hasLogo ? <img alt={props.practice.name} src={props.practice.logoUrl}/> : <span id={ `${props.practice.name.split(/\s+/).join('_').toLowerCase()}`} className="practiceName">{props.practice.name}</span>}</div>
            <div id="practiceWelcomeText" className="practiceWelcome">
              {props.practice.welcomeMessage && <WelcomeMessage welcomeMessage={props.practice.welcomeMessage} {...props}/>}
            </div>
          </div>
        </div>
        <div className="practiceBody">
          <TabBar>
            <Tab matchPath="providers" title={props.messages.practice_visit_now} stateToPassAlong={{ practice: props.practice.toString() }} {...props}/>
            {props.practice.showScheduling && <Tab matchPath="appointment" title={props.messages.practice_schedule_appointment} stateToPassAlong={{ practice: props.practice.toString() }} {...props}/> }
          </TabBar>
          <Route path={`${props.match.url}/providers`} render={() => (
            <div className="practiceGrid">
              <span className="practiceTitle">{props.messages.practice_my_providers}</span>
              {props.showFirstAvailableOption &&
                <StartFirstAvailableSearchComponent {...props}/>
              }
              <ProviderGrid {...props}/>
            </div>)}
          />
          {props.practice.showScheduling && <Route path={`${props.match.url}/appointment`} render={() => (
            <ScheduleAppointmentContainer {...props}/>)}
          /> }
        </div>
      </div>
    </div>
  );
};

PracticeComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  history: PropTypes.object.isRequired,
  sdk: PropTypes.object.isRequired,
  practice: PropTypes.object.isRequired,
  providers: PropTypes.array.isRequired,
  toggleWelcomeMessage: PropTypes.func.isRequired,
  logger: PropTypes.object.isRequired,
};
PracticeComponent.defaultProps = {};
export default PracticeComponent;
