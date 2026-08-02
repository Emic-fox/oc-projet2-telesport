import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { Event, NavigationEnd, Router } from '@angular/router';

import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let service: NavigationService;
  let routerEvents: Subject<Event>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;

  function emitNavigationEnd(url: string): void {
    routerEvents.next(new NavigationEnd(0, url, url));
  }

  beforeEach(() => {
    routerEvents = new Subject<Event>();
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl'], { events: routerEvents });
    locationSpy = jasmine.createSpyObj<Location>('Location', ['back']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
      ]
    });
    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to the home page when no navigation was recorded yet', () => {
    service.goBack();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
    expect(locationSpy.back).not.toHaveBeenCalled();
  });

  it('should navigate to the home page when only the current page was recorded', () => {
    emitNavigationEnd('/country/France');

    service.goBack();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
    expect(locationSpy.back).not.toHaveBeenCalled();
  });

  it('should go back in browser history once a previous page was recorded', () => {
    emitNavigationEnd('/');
    emitNavigationEnd('/country/France');

    service.goBack();

    expect(locationSpy.back).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should still be able to go back after a previous goBack() call', () => {
    emitNavigationEnd('/');
    emitNavigationEnd('/country/France');
    emitNavigationEnd('/country/Germany');

    service.goBack(); // back to France
    emitNavigationEnd('/country/France'); // the real browser back triggers a new NavigationEnd

    service.goBack(); // back to home

    expect(locationSpy.back).toHaveBeenCalledTimes(2);
  });
});
