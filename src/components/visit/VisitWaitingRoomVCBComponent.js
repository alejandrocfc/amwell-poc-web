/*!
 * American Well Consumer Web SDK
 *
 * Copyright (c) 2020 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import './VisitComponents.css';
import GenericModal from "../popups/info/GenericModal";
import {isValidPhoneNumber} from "../Util";
import {PhoneNumberInput} from "../form/Inputs";

class VisitWaitingRoomVCBComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.info('VisitWaitingRoomVCBComponent: props', props);
    this.state = {
        isVcbPhoneNumberConfirmModalOpen: false,
        vcbPhoneNumberValidationError: false,
        vcbRequestSubmitted: false,
    };
  }

  submitVCBRequest(e) {
    if (e) e.preventDefault();
    this.props.submitVCBRequest(e)
      .then(vcbRequestSubmitted => {
        if (vcbRequestSubmitted) {
          this.setState({ vcbRequestSubmitted });
        }
      });
    this.setState({ isVcbPhoneNumberConfirmModalOpen: false });
  }

  toggleVcbPhoneNumberConfirmModal(e) {
    if (isValidPhoneNumber(this.props.vcbPhoneNumberLink.value)) {
        this.setState(prevState => ({
            isVcbPhoneNumberConfirmModalOpen: !prevState.isVcbPhoneNumberConfirmModalOpen,
        }));
    }
  }

  render() {
    return (
      <div className="visitWaitingRoomVCB">
          {!this.state.vcbRequestSubmitted &&
          <React.Fragment>
              <div className="vcbHoldPlace">
                  <div className="vcbHoldPlaceTextTitle">
                      {this.props.messages.visit_waiting_room_vcb_hold_place_title}
                  </div>
                  <div className="vcbHoldPlaceTextMessage">
                      {this.props.messages.visit_waiting_room_vcb_hold_place_text}
                  </div>
              </div>
              <div className="vcbPhoneNumber">
                <div className="vcbMobilePhoneNumber">
                    {this.props.messages.visit_waiting_room_vcb_mobile_number}
                </div>
                <PhoneNumberInput
                    locale={this.props.locale}
                    className="vcbPhoneInput"
                    valueLink={this.props.vcbPhoneNumberLink}
                    name="vcbPhoneInput"
                    placeholder={this.props.messages.visit_waiting_room_sms_mobile_number} />
                <div className="vcbMobileNumberSubmit">
                  <button
                      className="vcbMobileNumberSubmitButton"
                      onClick={e => this.toggleVcbPhoneNumberConfirmModal(e)}>
                        {this.props.messages.visit_waiting_room_vcb_text_me_button}
                  </button>
                </div>
                <div>
                  <span className="stayHereRequest">
                      <button
                          className="link-like"
                          onClick={e => this.props.toggleDisplayVCBInput(e)}>{this.props.messages.visit_waiting_room_vcb_stay_here}
                      </button>
                  </span>
                  <span>  |  </span>
                  <span className="visitCancelRequest">
                      <button
                          className="link-like"
                          onClick={e => this.props.toggleCancelModal(e)}>{this.props.messages.visit_cancel}
                      </button>
                  </span>
                </div>
              </div>
          </React.Fragment>
          }
          {this.state.vcbRequestSubmitted &&
          <div className="vcbRequestSubmittedText">
              <div className="vcbAllSet">
                  {this.props.messages.visit_waiting_room_vcb_all_set}
              </div>
              <div className="vcbCloseWindow">
                  {this.props.messages.visit_waiting_room_vcb_you_will_receive_text}
              </div>
              <div className="visitCancelRequest">
                  <button
                      className="link-like"
                      onClick={e => this.props.toggleCancelModal(e)}>{this.props.messages.visit_cancel}
                  </button>
              </div>
          </div>
          }

        <GenericModal
            className='vcbPhoneNumberConfirmModal'
            isOpen={this.state.isVcbPhoneNumberConfirmModalOpen}
            header={this.props.messages.visit_waiting_room_vcb_we_will_text_you}
            showClose={true}
            toggle={e => this.toggleVcbPhoneNumberConfirmModal(e)}
            message={
                <div className="vcbPhoneNumberConfirmModalBody">
                    <div className="vcbPhoneNumberConfirmText">{this.props.messages.visit_waiting_room_vcb_confirm_number}{this.props.vcbPhoneNumberLink.value}</div>
                </div>
            }>
          <div className='vcbPhoneNumberConfirmModalFooter'>
              <Button className="vcbPhoneNumberChangeButton" onClick={e => this.toggleVcbPhoneNumberConfirmModal(e)}>
                {this.props.messages.change2}
              </Button>
              <Button className="vcbPhoneNumberConfirmButton" onClick={e => this.submitVCBRequest(e)}>
                {this.props.messages.confirm2}
              </Button>
          </div>
        </GenericModal>
      </div>
    );
  }
}
VisitWaitingRoomVCBComponent.propTypes = {
    messages: PropTypes.any.isRequired,
    logger: PropTypes.object.isRequired,
    toggleCancelModal: PropTypes.func.isRequired,
    submitVCBRequest: PropTypes.func.isRequired,
    toggleDisplayVCBInput: PropTypes.func.isRequired
};

VisitWaitingRoomVCBComponent.defaultProps = { };
export default VisitWaitingRoomVCBComponent;
