import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackLinkComponent } from './back-link.component';
import { NavigationService } from '@services/navigation.service';

describe('BackLinkComponent', () => {
  let component: BackLinkComponent;
  let fixture: ComponentFixture<BackLinkComponent>;
  let navigationServiceSpy: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    navigationServiceSpy = jasmine.createSpyObj<NavigationService>('NavigationService', ['goBack']);

    await TestBed.configureTestingModule({
      imports: [BackLinkComponent],
      providers: [
        { provide: NavigationService, useValue: navigationServiceSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')).toBeTruthy();
  });

  it('should display "Go back" text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.textContent).toContain('Go back');
  });

  it('should trigger goBack() on click', () => {
    spyOn(component, 'goBack').and.callThrough();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;

    button.click();

    expect(component.goBack).toHaveBeenCalled();
  });

  it('should delegate to NavigationService.goBack()', () => {
    component.goBack();

    expect(navigationServiceSpy.goBack).toHaveBeenCalled();
  });
});
