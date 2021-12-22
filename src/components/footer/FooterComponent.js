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
import { FormattedMessage } from 'react-intl';
import './FooterComponent.css';

class FooterComponent extends React.Component {
  render() {
    const version = this.props.sdkVersion;
    const currentYear = (new Date()).getFullYear();
    return (
      <footer>
        <FormattedMessage id="footer_copyright" values={{ currentYear }} />
        <FormattedMessage id="footer_sdk_version" values={{ version }} />
      </footer>
    );
  }
}

FooterComponent.propTypes = {};
FooterComponent.defaultProps = {};
export default FooterComponent;
