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
import PageComponent from '../components/layout/PageComponent';
import banner from '../components/images/banners/man-smiling-tablet.png'
import MyRecordsComponent from '../components/myrecords/MyRecordsComponent';

class MyRecordsContainer extends React.Component {
  render() {
    return (
      <PageComponent banner={banner} unpadded={true}>
        <MyRecordsComponent {...this.props}/>
      </PageComponent>
    );
  }
}

MyRecordsContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired
};
MyRecordsContainer.defaultProps = {};
export default MyRecordsContainer;
