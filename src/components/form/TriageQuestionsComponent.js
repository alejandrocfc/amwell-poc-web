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
import { FormGroup, Label } from 'reactstrap';
import { TextInputRaw } from '../form/Inputs';

class TriageQuestionsComponent extends React.Component {
  render() {
    this.props.logger.debug('TriageQuestionsComponent: props', this.props);
    const triageQuestions = [];
    if (this.props.triageQuestions != null) {
      this.props.triageQuestions.forEach((question, idx) => {
        const id = `triageQuestions${idx}`;
        triageQuestions.push(
          <FormGroup key={id}>
            <Label className="triageQuestion">
              <span dangerouslySetInnerHTML={{ __html: question.question }} ></span>
              <TextInputRaw id={id} name={id} valueLink={this.props.valueLinks[id]} />
            </Label>
          </FormGroup>);
      });
    }

    return (
      <div>
        { triageQuestions }
      </div>
    );
  }
}

TriageQuestionsComponent.propTypes = {
  triageQuestions: PropTypes.arrayOf(PropTypes.object),
  valueLinks: PropTypes.object.isRequired,
};

export default TriageQuestionsComponent;
