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
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

class NoMatchComponent extends React.Component {

  render() {
    return (
      <Link to="/"><FormattedMessage id="back_home" /></Link>
    );
  }
}

NoMatchComponent.propTypes = {};
NoMatchComponent.defaultProps = {};
export default NoMatchComponent;
