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
import { FormattedMessage, FormattedNumber } from 'react-intl';

import GenericModal from '../popups/info/GenericModal';

const VisitExtensionModal = (props) => {
  // otherwise warning is thrown about currency not being an obj
  // eslint-disable-next-line
  const cost = <FormattedNumber value={props.visitExtension.extensionCost} style='currency' currency={props.sdk.getSystemConfiguration().currencyCode} minimumFractionDigits={2} maximumFractionDigits={2}/>;
  const line1 = <FormattedMessage id="visit_extension_offered" defaultMessage={ props.messages.visit_extension_offered } values={{ providerName: props.providerName }} />;
  const line2 = <FormattedMessage id="visit_extension_cost_and_time" defaultMessage={ props.messages.visit_extension_cost_and_time } values={{ time: props.visitExtension.extensionTime, cost }} />;

  return (
    <GenericModal
      isOpen={props.showExtendedVisitModal}
      toggle={props.toggleExtendVisitModal}
      header={props.messages.visit_extension_header}
      message={
        <div>
          <p>{line1}</p>
          <p>{line2}</p>
          <p>{props.messages.visit_extension_agree}</p>
        </div>}>
      <button onClick={() => props.acceptPaidVisitExtension(false)}>{props.messages.no2}</button>
      <button onClick={() => props.acceptPaidVisitExtension(true)}>{props.messages.yes2}</button>
    </GenericModal>
  );
};
VisitExtensionModal.propTypes = {
  sdk: PropTypes.any.isRequired,
  messages: PropTypes.any.isRequired,
  visitExtension: PropTypes.object.isRequired,
  providerName: PropTypes.string.isRequired,
  showExtendedVisitModal: PropTypes.bool.isRequired,
  toggleExtendVisitModal: PropTypes.func.isRequired,
  acceptPaidVisitExtension: PropTypes.func.isRequired,
};
export default VisitExtensionModal;
