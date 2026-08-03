// This file is required by karma.conf.js.
// The .spec.ts files themselves are discovered and injected as webpack entries
// by Angular CLI's FindTestsPlugin, so this file only needs to set up the testing environment.

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
