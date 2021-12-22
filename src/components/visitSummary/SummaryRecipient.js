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

class SummaryRecipient {
  constructor(value, isSelected = false, hasError = false) {
    this.value = value;
    this.isSelected = isSelected;
    this.hasError = hasError;
  }
}
export default SummaryRecipient;
