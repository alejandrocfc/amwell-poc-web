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
import { Checkbox, TextInput } from '../form/Inputs';

class VisitTopicsComponent extends React.Component {
  render() {
    this.props.logger.debug('VisitTopicsComponent: props', this.props);
    const visitTopics = [];
    if (this.props.topics != null) {
      this.props.topics.forEach((topic, idx) => {
        const id = `topics${idx}`;
        visitTopics.push(
          <Checkbox key={id} id={id} name={id} checkedLink={this.props.valueLinks[id]}>
            {topic.title}
          </Checkbox>);
      });
    }

    let otherTopic = [];
    if (this.props.sdk.getSystemConfiguration().otherTopicEnabled) {
      let otherMessage = this.props.messages.visit_intake_topics_other;
      if (this.props.topics === null) {
        otherMessage = this.props.messages.visit_intake_what_would_you_like_to_discuss;
      }

      otherTopic =
          <TextInput id="topicOther" name="topicOther" placeholder={otherMessage} valueLink={this.props.valueLinks.topicOther} />;
    }

    let visitIntakeTopics = [];
    if (this.props.sdk.getSystemConfiguration().otherTopicEnabled || this.props.topics !== null) {
      visitIntakeTopics =
        <div>
          {visitTopics}
          {otherTopic}
        </div>;
    }


    return (
      <div>
        { visitIntakeTopics }
      </div>
    );
  }
}

VisitTopicsComponent.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.object),
  valueLinks: PropTypes.object.isRequired,
};

export default VisitTopicsComponent;
