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
import ReactDOMServer from 'react-dom/server';
import { FormattedDate, IntlProvider } from 'react-intl';

import { getLanguage } from '../Util';

// Mimics as closely as possible the existing formatting on a forward or reply secure message for new messages
export default function formatBody(detailedMessage, locale, messages) {
  return ReactDOMServer.renderToStaticMarkup(
    <div>
      <br/>
      <br/>
      <hr/>
      <br/>
      <br/>
      <span style={{ fontFamily: 'Tahoma' }}>
        <span style={{ color: 'rgb(0,137,169)' }}>
          <b>{messages.secure_message_compose_formatted_body_from}:&nbsp;</b>
        </span>
        {detailedMessage.sender ? detailedMessage.sender.name : '' }
        <br/>
        <span style={{ color: 'rgb(0,137,169)' }}>
          <b>{messages.secure_message_compose_formatted_body_sent}:&nbsp;</b>
        </span>
        <IntlProvider locale={getLanguage(locale)} messages={messages}>
          <FormattedDate value={detailedMessage.date}
            year='numeric'
            month='numeric'
            day='numeric'
            hour='2-digit'
            minute='2-digit'
            timeZone='UTC'
            timeZoneName='short'/>
        </IntlProvider>
        <br/>
        <span style={{ color: 'rgb(0,137,169)' }}>
          <b>{messages.secure_message_compose_formatted_body_to}:&nbsp;</b>
        </span>
        {detailedMessage.recipients.map((r, index) => {
          let name;
          if (index === 0 || index === detailedMessage.recipients.length - 1) {
            name = r.fullName;
          } else {
            name = `${r.fullName}, `;
          }
          return <span key={r.id.persistentId}>{name}</span>;
        })}
        <br/>
        <span style={{ color: 'rgb(0,137,169)' }}>
          <b>{messages.secure_message_compose_formatted_body_subject}:&nbsp;</b>
        </span>
        {detailedMessage.subject}
      </span>
      <br/>
      <br/>
      <div dangerouslySetInnerHTML={{ __html: detailedMessage.body.replace('#msgHorizontalDivider', '<hr/>') }}/>
    </div>);
}
