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
import { Container, Row } from 'reactstrap';

import './ProviderGridComponent.css';
import ProviderDetailsComponent from './ProviderDetailsComponent';
import ProviderCardComponent from './ProviderCardComponent';


class ProviderGridComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('ProviderGridComponent: props', this.props);
    this.providerDetailsRef = null;
    this.setProviderDetailsRef = (element) => {
      this.providerDetailsRef = element;
    };
  }

  componentDidUpdate() {
    if (this.providerDetailsRef) {
      this.providerDetailsRef.scrollIntoView({ behavior: 'smooth' });
    }
  }

  render() {
    this.props.logger.debug('ProviderGridComponent: props', this.props);

    const rows = [];
    let columns = [];
    let providerDetails = null;

    this.props.providers.forEach((provider, index) => {
      const count = index + 1;
      columns.push(<ProviderCardComponent key={provider.id.encryptedId} provider={provider} {...this.props}/>);

      if (this.props.selectedProvider && this.props.selectedProvider.id.persistentId === provider.id.persistentId) {
        providerDetails = (<Row key="details" className="providerDetailsRow"><ProviderDetailsComponent setProviderDetailsRef={this.setProviderDetailsRef} providerPosition={count % 3 || 3} providerDetails={this.props.selectedProvider} {...this.props}/></Row>);
      }

      if (count % 3 === 0 || count === this.props.providers.length) {
        rows.push(<Row key={provider.id.encryptedId} className="providerRow">{columns}</Row>);
        columns = [];

        if (providerDetails) {
          rows.push(providerDetails);
          providerDetails = null;
        }
      }
    });

    return (
      <Container className="providerGridContainer">
        {rows}
      </Container>
    );
  }
}

ProviderGridComponent.propTypes = {
  history: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  providers: PropTypes.array.isRequired,
  logger: PropTypes.object.isRequired,
  handleProviderClick: PropTypes.func.isRequired,
};
ProviderGridComponent.defaultProps = {};
export default ProviderGridComponent;
