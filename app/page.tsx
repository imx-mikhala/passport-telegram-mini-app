'use client'

import React from 'react';
import Home from './Home';
import { passport } from '@imtbl/sdk';
import { Environment, ImmutableConfiguration } from '@imtbl/sdk/config';
import { Passport } from '@imtbl/sdk/passport';
import Script from "next/script";

export const passportInstance: Passport = new passport.Passport({
  baseConfig: new ImmutableConfiguration({ environment: Environment.SANDBOX }),
  clientId: 'CLIENT_ID_HERE',
  redirectUri: 'localhost:3000/redirect',
  logoutRedirectUri: 'localhost:3000/logout',
  audience: 'platform_api',
  scope: 'openid offline_access email transact',
});

export default function App() {
  return <>
    <Script src="https://telegram.org/js/telegram-web-app.js" />
    <Home />
  </>
};
