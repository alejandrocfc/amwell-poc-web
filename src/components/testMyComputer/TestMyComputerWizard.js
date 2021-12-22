/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2019 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Icon from './images/icon-test-computer.svg';


import './TestMyComputerWizard.css';

const TestMyComputerWizard = (props) => { // eslint-disable-line arrow-body-style
  return (
    <div className='testMyComputerWizard'>
      <div className='testMyComputerSideBar'>
        <div>
          <img src={Icon} alt={props.messages.test_my_computer}/>
          <div>{props.messages.test_my_computer}</div>
        </div>
      </div>
      <div className='testMyComputerWizardContainer' ref={props.tmcRef} />
      <button className='testMyComputerExitButton' onClick={props.exitTestMyComputer}>{props.messages.exit}</button>
    </div>
  );
};

TestMyComputerWizard.propTypes = {
  tmcRef: PropTypes.any.isRequired,
};
TestMyComputerWizard.defaultProps = {};
export default TestMyComputerWizard;
