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
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Modal, FormGroup, Input, Label, ModalHeader, ModalBody, ModalFooter, Button, Form } from 'reactstrap';
import { Checkbox, EmailInput } from '../form/Inputs';
import './MyProfileComponent.css';

export function DependentCheckBoxesComponent(props) {
  return (
    <div className='dependentAccessCheckbox'>
      {props.dependents.map(dependent =>
        <Checkbox key={dependent.id.persistentId} checkedLink={props.valueLinks[dependent.id.persistentId]}>
          <div className="dependentAccessTextContent">
            <span className="dependentAccessFullname">{dependent.fullName}</span>
            <div className="dependentAccessDOB">{props.messages.dob} <FormattedDate value={dependent.dob} year='numeric' month='long' day='numeric' timeZone='utc'/></div>
          </div>
        </Checkbox>)}
    </div>
  );
}

export function MyProfileDependentAccessRequestComponent(props) {
  return (
    <div className='notificationContent'>
      <div className='notificationHeader'>
        <span className='notificationHeaderTitle'>{props.messages.dependent_linking_notification}</span>
      </div>
      <div className='notificationBody'>
        <span className='notificationBodyTitle'>{props.messages.dependent_linking_access_request_title}</span>
        <span className='notificationBodyText'>{props.messages.dependent_linking_someone_requested_access}</span>
      </div>
      <div className='notificationFooter'>
        <span onClick={props.enableShowAccessRequest} className='notificationFooterText'>{props.messages.dependent_linking_view_request}</span>
      </div>
    </div>
  );
}

export function MyProfileDependentAccessRequestDetailsComponent(props) {
  return (
    <div className='accessRequestContent'>
      <div className='accessRequestHeader'>
        <span className='accessRequestHeaderTitle'>{props.messages.dependent_linking_access_request_title_upper}</span>
        <span className='accessRequestHeaderSubtitle'><FormattedMessage id='dependent_linking_access_request_subtitle' defaultMessage={ props.messages.dependent_linking_access_request_subtitle } values={ { otherParent: props.accessRequest.requestor.fullName } } /></span>
      </div>
      <div className='accessRequestBody'>
        <div className='accessRequestBodyIntro'><FormattedMessage id='dependent_linking_grant_access_text' defaultMessage={ props.messages.dependent_linking_grant_access_text } values={ { otherParent: props.accessRequest.requestor.fullName } } /></div>
        <Form>
          <DependentCheckBoxesComponent dependents={props.accessRequest.dependents} valueLinks={props.valueLinks} messages={props.messages} />
          <div className='accessRequestDisclaimer'><FormattedMessage id='dependent_linking_access_request_disclaimer' defaultMessage={ props.messages.dependent_linking_access_request_disclaimer } values={ { otherParent: props.accessRequest.requestor.fullName } } /></div>
          <div className='accessRequestFooter'>
            <Button className='dependentLinkingButton accessButton' onClick={props.acceptAccessRequest}>{props.messages.dependent_linking_grant_access}</Button>
            <span onClick={props.declineAccessRequest}>{props.messages.dependent_linking_do_not_grant_access}</span>
          </div>
        </Form>
      </div>
    </div>
  );
}

export function DependentLinkingChooseComponent(props) {
  return (
    <Modal className={`${props.direction} dependentLinkingModal`} dir={props.direction} toggle={props.toggleAddOrLinkDependentModal} isOpen={props.addOrLinkDependentModalEnabled}>
      <ModalHeader className='header'>
        {props.messages.dependent_linking_add_a_child}
      </ModalHeader>
      <ModalBody className='dependentLinkingModalBody'>
        <p className='dependentLinkingBodyText bold'>{props.messages.dependent_linking_what_to_do}</p>
        <div className='dependentLinkingCheckBoxes'>
          <FormGroup check>
            <Label check>
              <Input onChange={props.chooseCreateDependent} value="createDependent" type="radio" name="option" /> {' '}
              {props.messages.dependent_linking_create_new_profile}
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input onChange={props.chooseLinkDependent} value="linkDependent" type="radio" name="option" />{' '}
              {props.messages.dependent_linking_link_to_existing_profile}
            </Label>
          </FormGroup>
        </div>
      </ModalBody>
      <ModalFooter className='dependentLinkingFooter'>
        <Button className='dependentLinkingButton' onClick={props.toggleAddOrLinkDependentModal}>{props.messages.dependent_linking_cancel}</Button>
        <Button disabled={!props.selectedCreateDependent && !props.selectedLinkDependent} className='dependentLinkingButton' onClick={props.toggleModalThenTakeAction}>{props.messages.dependent_linking_continue}</Button>
      </ModalFooter>
    </Modal>
  );
}

export function DependentLinkingAddComponent(props) {
  return (
    <Modal className={`${props.direction} dependentLinkingModal`} toggle={props.toggleAddChildModal} dir={props.direction} isOpen={props.addChildModalEnabled}>
      <ModalHeader className='header' toggle={props.toggleAddChildModal}>
        {props.messages.dependent_linking_add_a_child}
      </ModalHeader>
      <ModalBody className='dependentLinkingModalBody linkDependent'>
        <p className='dependentLinkingBodyText'>{props.messages.dependent_linking_add_a_child_body_text}</p>
        <p className='dependentLinkingBodyText'>{props.messages.dependent_linking_your_child_behalf}</p>
        <p className='dependentLinkingBodyText'>{props.messages.dependent_linking_enter_parent_email}</p>
        <div className='dependentLinkingEmailBox'>
          <EmailInput className='linkedParentEmail' valueLink={props.valueLinks.linkedParentEmail} placeholder={props.messages.dependent_linking_email_guardian_placeholder} />
        </div>
        <p className='dependentLinkingDisclaimer'>{props.messages.dependent_linking_disclaimer_text}</p>
      </ModalBody>
      <ModalFooter className='dependentLinkingFooter addChildModal'>
        <Button disabled={!props.valueLinks.linkedParentEmail.value || props.valueLinks.linkedParentEmail.error} className='dependentLinkingButton largeButton' onClick={props.sendLinkDependentRequest}>{props.messages.dependent_linking_add_a_child_send_request}</Button>
        <span onClick={props.addDependentWithoutCheck}>{props.messages.dependent_linking_continue_without_linking}</span>
      </ModalFooter>
    </Modal>
  );
}

export function DependentLinkingLinkComponent(props) {
  return (
    <Modal className={`${props.direction} dependentLinkingModal`} toggle={props.toggleLinkDependentModal} dir={props.direction} isOpen={props.linkDependentModalEnabled}>
      <ModalHeader className='header' toggle={props.toggleLinkDependentModal}>
        {props.messages.dependent_linking_link_this_child}
      </ModalHeader>
      <ModalBody className='dependentLinkingModalBody linkDependent'>
        <p className='dependentLinkingBodyText'>{props.messages.dependent_linking_link_this_child_body_text}</p>
        <p className='dependentLinkingBodyText'>{props.messages.dependent_linking_your_child_behalf}</p>
        <p className='dependentLinkingBodyText'>{props.messages.dependent_linking_enter_parent_email}</p>
        <div className='dependentLinkingEmailBox'>
          <EmailInput className='linkedParentEmail' valueLink={props.valueLinks.linkedParentEmail} placeholder={props.messages.dependent_linking_email_guardian_placeholder} />
        </div>
        <p className='dependentLinkingDisclaimer'>{props.messages.dependent_linking_disclaimer_text}</p>
      </ModalBody>
      <ModalFooter className='dependentLinkingFooter'>
        <Button disabled={!props.valueLinks.linkedParentEmail.value || props.valueLinks.linkedParentEmail.error} className='dependentLinkingButton largeButton' onClick={props.sendLinkDependentRequest}>{props.messages.dependent_linking_add_a_child_send_request}</Button>
      </ModalFooter>
    </Modal>
  );
}

export function DependentLinkingRequestConfirmationComponent(props) {
  return (
    <Modal className={`${props.direction} dependentLinkingModal`} toggle={props.disableRequestConfirmation} dir={props.direction} isOpen={props.linkRequestSentModalEnabled} >
      <ModalHeader className='header' >
        {props.messages.dependent_linking_thank_you}
      </ModalHeader>
      <ModalBody className='dependentLinkingModalBody messageSent'>
        <p className='dependentLinkingBodyText'><FormattedMessage id='dependent_linking_link_sent_text' defaultMessage={ props.messages.dependent_linking_link_sent_text } values={ { otherParentEmail: props.valueLinks.linkedParentEmail.value } } /></p>
      </ModalBody>
      <ModalFooter className='dependentLinkingFooter'>
        <Button className='dependentLinkingButton' onClick={props.disableRequestConfirmation}>{props.messages.dependent_linking_ok}</Button>
      </ModalFooter>
    </Modal>
  );
}
