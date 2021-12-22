/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2017 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import HeaderNotification from './HeaderNotificationComponent';
import { getLanguage, truncateForDisplay, composeFullName } from '../Util';
import Logo from './images/my-care-logo.svg';

import './HeaderComponent.css';

class HeaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.goHome = this.goHome.bind(this);
    this.props.logger.debug('HeaderComponent props', props);
    this.navMenu = false;
    this.depMenu = false;
    this.pathRegex = /^\/visit(\/[^/]*)*$/;
  }

  triggerNavComponent({ toggleMenus }) {
    if ((!this.click) && (this.navMenu)) {
      this.navMenu = false;
    }

    const onClick = () => {
      this.navMenu = !this.navMenu;
      this.click = true;
      toggleMenus();
    };

    let menuClass = 'navbar-toggler';
    if (this.navMenu && this.click) {
      menuClass = 'navbar-toggler open';
    }
    this.click = false;

    if (this.props.isHeaderMenuDisabled) {
      return (<button className={menuClass}></button>);
    }
    return (<button className={menuClass} onClick={onClick}></button>);
  }

  triggerDepComponent({ toggleMenus }) {
    if ((!this.click) && (this.depMenu)) {
      this.depMenu = false;
    }

    const onClick = () => {
      this.depMenu = !this.depMenu;
      this.click = true;
      toggleMenus();
    };

    let menuClass = 'depbar-toggler';
    if (this.depMenu && this.click) {
      menuClass = 'depbar-toggler open';
    }
    this.click = false;

    if (this.props.isHeaderMenuDisabled) {
      return (<button className={menuClass}></button>);
    }
    return (<button className={menuClass} onClick={onClick}></button>);
  }


  handleLocaleClick(e, locale) {
    e.preventDefault();
    this.props.changeLocaleCallback(locale);
  }

  goHome() {
    this.props.history.push('/');
  }

  activateConsumer(e, user) {
    this.props.activateConsumer(user);
  }

  render() {
    let welcomeNavItem = null;
    let menuItems = null;
    const pathName = this.props.location.pathname;
    const isInVisitMode = !!(pathName && pathName.match(this.pathRegex));
    const languageBar = [];
    this.props.supportedLocales.forEach((locale, index) => {
      const lang = getLanguage(locale);
      const language = this.props.messages[`language_${lang}`];
      if (this.props.locale === locale) {
        languageBar.unshift(<span key={index} className='activeLanguage'>{language}</span>);
      } else {
        const href = `?language=${locale}`;
        languageBar.push(<span key={100 + index} className='languageSeparator'>|</span>);
        languageBar.push(<a key={index} className='inactiveLanguage' href={href} onClick={e => this.handleLocaleClick(e, locale)}>{language}</a>);
      }
    });

    const Styles = {
      navMenusStyle: {
        boxShadow: '1px 1px 2px rgba(90, 90, 90, 0.7)',
        backgroundColor: '#fff',
        zIndex: 1000,
        marginTop: '21px',
        width: '253px',
        fontWeight: '800',
      },
      navMenuStyle: {
        padding: '8px',
        backgroundColor: '#efa825',
        color: '#fff',
        fontWeight: '800',
      },

      depMenusStyle: {
        boxShadow: '1px 1px 2px rgba(90, 90, 90, 0.7)',
        backgroundColor: '#fff',
        zIndex: 1000,
        marginTop: '4px',
        minWidth: '275px',
        fontWeight: '800',
        fontSize: '14px',
        marginLeft: '-250px',
        lineHeight: '35px',
        letterSpacing: '0.03em',
      },
    };

    if (this.props.authenticated) {
      if (this.props.consumer) {
        let depMenu = null;
        const depSubMenu = [];
        if (this.props.dependents && this.props.dependents.length > 0 && !isInVisitMode) {
          const { formatMessage, formatDate } = this.context.intl;
          let dob = null;
          let strEntry = null;
          if (this.props.activeConsumer.id.persistentId !== this.props.consumer.id.persistentId) {
            dob = formatDate(this.props.consumer.dob, { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' });
            strEntry = formatMessage({ id: 'dependent_menu' }, { fullName: truncateForDisplay(composeFullName(this.props.consumer, null, this.props.direction), 15), dob });
            depSubMenu.push(<p key={strEntry} text={strEntry} onClick={e => this.activateConsumer(e, this.props.consumer)}/>);
          }
          this.props.dependents.forEach((dependent) => {
            if (this.props.activeConsumer.id.persistentId !== dependent.id.persistentId) {
              dob = formatDate(dependent.dob, { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' });
              strEntry = formatMessage({ id: 'dependent_menu' }, { fullName: truncateForDisplay(composeFullName(dependent, null, this.props.direction), 15), dob });
              depSubMenu.push(<p key={dependent.id.persistentId} text={strEntry} onClick={e => this.activateConsumer(e, dependent)}/>);
            }
          });
        }
        depSubMenu.push(<p key='logout' text={this.props.messages.menu_logout} link="/logout"/>);

        depMenu =
          <div className='headerDepMenu' label='depMenu' style={Styles.depMenusStyle} triggerComponent={this.triggerDepComponent.bind(this)}>
            {depSubMenu}
          </div>;

        let firstName = this.props.activeConsumer ? this.props.activeConsumer.firstName : this.props.consumer.firstName;
        if (firstName.length > 15) {
          firstName = truncateForDisplay(firstName, 11);
        }
        welcomeNavItem =
          <div className='welcomeTxt'>
            <FormattedMessage id="navbar_welcome" values={{ firstName }}/>
            {depMenu}
          </div>;
      }

      menuItems =
        <div className='headerNavMenu' label='navMenu' style={Styles.navMenusStyle} triggerComponent={this.triggerNavComponent.bind(this)}>
          <p>Dasd</p>
        </div>;
    } else {
      menuItems =
        <div className='headerNavMenu' label='menu' style={Styles.navMenusStyle} triggerComponent={this.triggerNavComponent.bind(this)}>
          <p text={this.props.messages.menu_login} link="/login"/>
          <p text={this.props.messages.menu_test_my_computer} link="/testMyComputer"/>
          <p text={this.props.messages.setup} link="/setup"/>
        </div>;
    }
    const headerLogoDiv = (this.props.isHeaderMenuDisabled) ? <div id="header_logo" className="headerLogo"></div> : <div id="header_logo" className="headerLogo" onClick={this.goHome}></div>;
    return (
      <div id='header' className={classNames({ simpleHeader: this.props.isSimpleHeader })}>
        {this.props.isSimpleHeader ?
          <img alt={this.props.messages.test_my_computer_header} src={Logo} onClick={this.goHome}/>
          :
          <div className='headerContents'>
            {!this.props.isCartModeActive && menuItems}
            <div className='headerLogoContainer'>
              {headerLogoDiv}
            </div>
            <div className='headerRight'>
              <div className='languageBar'>{languageBar}</div>
              {!this.props.isCartModeActive &&
              <div className='headerUserInfo'>
                {this.props.authenticated && this.props.consumer && <HeaderNotification {...this.props} />}
                {welcomeNavItem}
              </div>}
              {this.props.isCartModeActive &&
              <div className='cartModeHeaderTitle'>{this.props.messages.cart_mode_cart_mode}</div>}
            </div>
          </div>
        }
      </div>
    );
  }
}

HeaderComponent.contextTypes = {
  intl: PropTypes.object,
};
HeaderComponent.propTypes = {
  supportedLocales: PropTypes.array.isRequired,
  logger: PropTypes.object.isRequired,
  activateConsumer: PropTypes.func.isRequired,
};
HeaderComponent.defaultProps = {};
export default HeaderComponent;
