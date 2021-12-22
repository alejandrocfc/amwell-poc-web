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
import { Button } from 'reactstrap';
import ProviderSilhouette from './images/icon-silo-provider.png';
import './FirstAvailable.css';
import YesNoModal from '../popups/info/YesNoModal';
import InformationModal from '../popups/info/InformationModal';

const FirstAvailableComponent = (props) => {
  props.logger.debug('FirstAvailableComponent: props', props);

  return (
    <div className="firstAvailable">
      <div className="firstAvailableHeader">
        <div className="firstAvailableSearchIcon" />
        <div className="firstAvailableHeaderTitle">{props.messages.first_available_provider_search}</div>
      </div>
      <div className="firstAvailableSearchBody">
        {!props.isSearchExhausted ?
          <div>
            <div className="searchExplanation">
              <div>{props.messages.first_available_provider_search_explanation_one}</div>
              <div>{props.messages.first_available_provider_search_explanation_two}</div>
            </div>
            <div className='waitingRoomProviderLogo'><img alt={props.messages.visit_reports_provider} src={ProviderSilhouette}/></div>
            <div className="cancelFirstAvailable"><button className="link-like" onClick={e => props.toggleCancelModal(e)}>{props.messages.first_available_cancel_search}</button></div>
          </div>
          : <div>
            <div className="searchExplanation">
              <div>{props.messages.first_available_provider_search_exhausted_title}</div>
              <div>{props.messages.first_available_provider_search_exhausted_blurb}</div>
            </div>
            <div className='providerExhaustedLogo'><img alt={props.messages.visit_reports_provider} src={ProviderSilhouette}/></div>
            <Button className="searchExhaustedOKButton" onClick={props.exitSearch}>
              {props.messages.ok}
            </Button>
          </div>
        }
      </div>
      <div>
        <YesNoModal
          isOpen={props.isCancelModalOpen}
          toggle={props.toggleCancelModal}
          messages={props.messages}
          header={props.messages.cancel_visit}
          message={props.messages.cancel_visit_txt}
          yesClickHandler={props.cancelFirstAvailableSearch} />
      </div>
      <div>
        <InformationModal
          isOpen={props.isSurescriptsErrorModalOpen}
          toggle={props.toggleSurescriptsErrorModal}
          messages={props.messages}
          header={props.cancelHeader}
          message={props.cancelMessage}
          clickHandler={props.cancelFirstAvailableSearch} />
      </div>
    </div>
  );
};

FirstAvailableComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
FirstAvailableComponent.defaultProps = {};
export default FirstAvailableComponent;
