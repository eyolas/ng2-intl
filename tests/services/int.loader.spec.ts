import { Injector } from '@angular/core';
import {
  HttpModule
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {
  IntlModule,
  IntlService,
  IntlLoader,
  IntlStaticLoader
} from './../../module';

import { getTestBed, TestBed } from '@angular/core/testing';

const translations: any = { TEST: 'This is a test' };
class FakeLoader implements IntlLoader {
  getMessages(lang: string): Observable<any> {
    return Observable.of(translations);
  }
}

describe('IntlLoader', () => {
  let injector: Injector;
  let translate: IntlService;

  const prepare = (_injector: Injector) => {
    translate = _injector.get(IntlService);
  };

  it('should be able to provide IntlStaticLoader', () => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        IntlModule.forRoot({provide: IntlLoader, useClass: FakeLoader })
      ]
    });
    injector = getTestBed();
    prepare(injector);

    expect(translate).toBeDefined();
    expect(translate.currentLoader).toBeDefined();
    expect(translate.currentLoader instanceof FakeLoader).toBeTruthy();

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    // this will request the translation from the backend because we use a static files loader for IntlService
    translate.getAsync('TEST').subscribe((res: string) => {
      expect(res).toEqual('This is a test');
    });
  });

  it('should be able to provide any IntlLoader', () => {
    class CustomLoader implements IntlLoader {
      getMessages(lang: string): Observable<any> {
        return Observable.of({ TEST: 'This is a test' });
      }
    }
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        IntlModule.forRoot({ provide: IntlLoader, useClass: CustomLoader })
      ]
    });
    injector = getTestBed();
    prepare(injector);

    expect(translate).toBeDefined();
    expect(translate.currentLoader).toBeDefined();
    expect(translate.currentLoader instanceof CustomLoader).toBeTruthy();

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    // this will request the translation from the CustomLoader
    translate.getAsync('TEST').subscribe((res: string) => {
      expect(res).toEqual('This is a test');
    });
  });
});
