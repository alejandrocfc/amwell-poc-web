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
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router-dom';
import './MyProfileComponent.css';
import MyProfileDependentDetailComponent from './MyProfileDependentDetailComponent';
import { composeFullName, truncateForDisplay } from '../Util';
import { MyProfileDependentAccessRequestComponent,
  MyProfileDependentAccessRequestDetailsComponent,
  DependentLinkingAddComponent,
  DependentLinkingChooseComponent,
  DependentLinkingLinkComponent,
  DependentLinkingRequestConfirmationComponent } from './DependentLinking';


class MyProfileDependentsComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyProfileDependentsComponent: props', props);
  }

  render() {
    if (this.props.isDependent) {
      return <Redirect to={{ pathname: '/services' }}/>;
    }
    const dependentsExist = this.props.dependents && this.props.dependents.length > 0;
    const dependentList = [];
    if (dependentsExist) {
      this.props.dependents.forEach((dependent, index) => {
        const otherParentsNames = dependent.proxies.filter(proxy => proxy.email !== this.props.activeConsumer.email).map(item => item.fullName).join(', ');
        const displayFullName = truncateForDisplay(composeFullName(dependent, this.props.consumerMiddleNameHandling, this.props.direction), 60);
        if (this.props.editMode === 'edit' && dependent.id.persistentId === this.props.selectedDependent.id.persistentId) {
          dependentList.push(<MyProfileDependentDetailComponent key={index} {...this.props} />);
        } else {
          dependentList.push(
            <div key={index} className="myProfileDependent">
              <div className="myProfileDependentName">{displayFullName}</div>
              <div className="myProfileDependentDob">{this.props.messages.dob}: <FormattedDate value={dependent.dob} year='numeric' month='long' day='numeric' timeZone='utc'/></div>
              <span className="myProfileLink" onClick={() => this.props.enableEditing(dependent)}>{this.props.messages.edit}</span>
              {otherParentsNames && <div className='myProfileDependentShared'><FormattedMessage id='dependent_linking_shared_with_text' defaultMessage={ this.props.messages.dependent_linking_shared_with_text } values={ { otherParentName: otherParentsNames } } /></div>}
            </div>);
        }
      });
    }
    return (
      <div className="myProfileContent">
        {this.props.showAccessRequest ?
          (<MyProfileDependentAccessRequestDetailsComponent {...this.props} />) :
          (<div>
            {this.props.accessRequest && this.props.accessRequest.dependents &&
              <MyProfileDependentAccessRequestComponent {...this.props} />
            }
            <div className="myProfileContentHeader">
              <span className="myProfileContentTitle">{this.props.messages.my_children2}</span>
              <span className="myProfileSeparator">|</span>
              {this.props.editMode === 'add' &&
                <span className="myProfileDependentLinkDisabled">{this.props.messages.add_a_child}</span>}
              {this.props.editMode !== 'add' &&
                <span className="myProfileLink" onClick={() => this.props.enableChoiceModal()}>{this.props.messages.add_a_child}</span>}
              <div className="myProfileContentHeaderText">
                {this.props.messages.my_profile_header_txt}
              </div>
            </div>
            <div className="myProfileContentBody">
              {this.props.editMode === 'add' &&
                <MyProfileDependentDetailComponent {...this.props} />}
              {dependentsExist &&
              <div className="myProfileDependentList">
                {dependentList}
              </div>}
              {!dependentsExist && this.props.editMode !== 'add' &&
              <div className="myProfileDependent">
                <div className="myProfileDependentName">{this.props.messages.none}</div>
              </div>
              }
            </div>
            {this.props.popUpMode === 'choose' &&
              <DependentLinkingChooseComponent {...this.props}/>
            }
            {this.props.popUpMode === 'add' &&
              <DependentLinkingAddComponent {...this.props} />
            }
            {this.props.popUpMode === 'link' &&
              <DependentLinkingLinkComponent {...this.props}/>
            }
            {this.props.popUpMode === 'requestConfirmation' &&
              <DependentLinkingRequestConfirmationComponent {...this.props} />
            }
          </div>)
        }
      </div>
    );
  }
}

MyProfileDependentsComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
MyProfileDependentsComponent.defaultProps = {};
export default MyProfileDependentsComponent;
