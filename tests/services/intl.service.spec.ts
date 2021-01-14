import {
  IntlModule,
  IntlService,
  LangChangeEvent
} from './../../module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';


describe('IntlService', () => {
  let injector: TestBed;
  let intlService: IntlService;
  let translations: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, IntlModule.forRoot()],
      providers: [IntlService]
    });
    injector = getTestBed();
    intlService = injector.get(IntlService);
    translations = { TEST: 'This is a test' };
  });

  it('is defined', () => {
    expect(IntlService).toBeDefined();
    expect(intlService).toBeDefined();
    expect(intlService instanceof IntlService).toBeTruthy();
  });

  it('should be able to get translations', () => {
    intlService.use('en');

    // this will request the translation from the backend because we use a static files loader for IntlService
    intlService.getAsync('TEST').subscribe((res: string) => {
      expect(res).toEqual('This is a test');
    });

    // mock response after the xhr request, otherwise it will be undefined
    translations = { TEST: 'This is a test', TEST2: 'This is another test' };

    // this will request the translation from downloaded translations without making a request to the backend
    intlService.getAsync('TEST2').subscribe((res: string) => {
      expect(res).toEqual('This is another test');
    });
  });

  it('should fallback to the default language', () => {
    intlService.use('fr');

    intlService.setDefaultLang('en');
    intlService.setTranslation('en', { TEST: 'This is a test' });

    translations = {};
    intlService.getAsync('TEST').subscribe((res: string) => {
      expect(res).toEqual('This is a test');
      expect(intlService.getDefaultLang()).toEqual('en');
    });
  });

  it(`should return undefined when it doesn't find a translation`, () => {
    intlService.use('en');
    translations = {};
    intlService.getAsync('TEST').subscribe((res: string) => {
      expect(res).toBeUndefined();
    });
  });

  it(`should return undefined when you haven't defined any translation`, () => {
    intlService.getAsync('TEST').subscribe((res: string) => {
      expect(res).toBeUndefined();
    });
  });

  it('should return an empty value', () => {
    intlService.setDefaultLang('en');
    intlService.setTranslation('en', { TEST: '' });

    intlService.getAsync('TEST').subscribe((res: string) => {
      expect(res).toEqual('');
    });
  });

  it('should throw if you forget the key', () => {
    intlService.use('en');

    expect(() => {
      intlService.getAsync(undefined);
    }).toThrowError('Parameter "key" required');

    expect(() => {
      intlService.getAsync('');
    }).toThrowError('Parameter "key" required');

    expect(() => {
      intlService.getAsync(null);
    }).toThrowError('Parameter "key" required');

    expect(() => {
      intlService.get(undefined);
    }).toThrowError('Parameter "key" required');
  });

  it('should be able to get translations with nested keys', () => {
    intlService.use('en');

    translations = {'TEST': {'TEST': 'This is a test'}, 'TEST2': {'TEST2': {'TEST2': 'This is another test'}}};
    intlService.getAsync('TEST.TEST').subscribe((res: string) => {
      expect(res).toEqual('This is a test');
    });

    intlService.getAsync('TEST2.TEST2.TEST2').subscribe((res: string) => {
      expect(res).toEqual('This is another test');
    });
  });

  it(`shouldn't override the translations if you set the translations twice `, (
    done: Function
  ) => {
    intlService.setTranslation('en', { TEST: 'This is a test' }, true);
    intlService.setTranslation('en', { TEST2: 'This is a test' }, true);
    intlService.use('en');

    intlService.getAsync('TEST').subscribe((res: string) => {
      expect(res).toEqual('This is a test');
      done();
    });
  });

  it(`shouldn't do a request to the backend if you set the translation yourself`, (
    done: Function
  ) => {
    intlService.setTranslation('en', { TEST: 'This is a test' });
    intlService.use('en');

    intlService.getAsync('TEST').subscribe((res: string) => {
      expect(res).toEqual('This is a test');
      done();
    });
  });

  it('should be able to get instant translations', () => {
    intlService.setTranslation('en', { TEST: 'This is a test' });
    intlService.use('en');

    expect(intlService.get('TEST')).toEqual('This is a test');
  });

  it('should return the key if instant translations are not available', () => {
    intlService.setTranslation('en', { TEST: 'This is a test' });
    intlService.use('en');

    expect(intlService.get('TEST2')).toBeUndefined();
  });

  it('should trigger an event when the lang changes', () => {
    const tr = { TEST: 'This is a test' };
    intlService.setTranslation('en', tr);
    intlService.onLangChange.subscribe((event: LangChangeEvent) => {
      expect(event.lang).toBe('en');
      expect(event.messages).toEqual(tr);
    });
    intlService.use('en');
  });

  it('should be able to add new langs', () => {
    intlService.addLangs(['pl', 'es']);
    expect(intlService.getLangs()).toEqual(['pl', 'es']);
    intlService.addLangs(['fr']);
    intlService.addLangs(['pl', 'fr']);
    expect(intlService.getLangs()).toEqual(['pl', 'es', 'fr']);

    // this will request the translation from the backend because we use a static files loader for IntlService
    intlService.use('en').subscribe((res: string) => {
      expect(intlService.getLangs()).toEqual(['pl', 'es', 'fr', 'en']);
      intlService.addLangs(['de']);
      expect(intlService.getLangs()).toEqual(['pl', 'es', 'fr', 'en', 'de']);
    });
  });
});
