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
import { Link, LinkedComponent } from 'valuelink';

/**
 * State Value Link that extends LinkedComponent
 * to set state for a specific value and reset errors etc
 */
class StateValueLink extends Link {
  constructor(component, key, value, error) {
    super(value);
    this.component = component;
    this.key = key;
    this.error = error;
  }
  set(x) {
    this.component.setField(this.key, x);
  }
}

class ValueLinkedContainer extends LinkedComponent {
  linkAll(keys) {
    const cache = this.links || (this.links = {});
    const excludeKeys = ['error', 'errorMessage', 'errors', 'modified'];
    const theKeys = keys && keys.length ? keys : Object.keys(this.state).filter(key => !excludeKeys.includes(key));
    theKeys.forEach((key) => {
      const value = this.state[key];
      const error = this.state.errors[key];
      const cached = cache[key];
      if (!cached || cached.value !== value || cached.error !== error) {
        cache[key] = new StateValueLink(this, key, value, error);
      }
    });
    return cache;
  }

  linkAt(key) {
    const value = this.state[key];
    const error = this.state.errors[key];
    const cache = this.links || (this.links = {});
    const cached = cache[key];
    const link = cached && cached.value === value && cached.error === error ? cached : cache[key] = new StateValueLink(this, key, value, error);
    return link;
  }

  setField(key, value) {
    this.setState((prevState) => {
      const errors = prevState.errors ? prevState.errors : [];
      delete errors[key];
      const modified = prevState.modified ? prevState.modified : [];
      modified[key] = true;
      const newState = { [key]: value, errors, modified };
      return newState;
    });
  }
}

export default ValueLinkedContainer;
