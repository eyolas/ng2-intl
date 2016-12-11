import {Injector} from '@angular/core';
import {ResponseOptions, Response, XHRBackend, HttpModule} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {
  IntlModule,
  IntlService,
  LangChangeEvent
} from './../../module';

import {getTestBed, TestBed} from '@angular/core/testing';

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('IntlService', () => {
    let injector: Injector;
    let backend: MockBackend;
    let intlService: IntlService;
    let connection: MockConnection; // this will be set when a new connection is emitted from the backend.

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, IntlModule.forRoot()],
            providers: [
                {provide: XHRBackend, useClass: MockBackend}
            ]
        });
        injector = getTestBed();
        backend = injector.get(XHRBackend);
        intlService = injector.get(IntlService);
        // sets the connection when someone tries to access the backend with an xhr request
        backend.connections.subscribe((c: MockConnection) => connection = c);
    });

    afterEach(() => {
        injector = undefined;
        backend = undefined;
        intlService = undefined;
        connection = undefined;
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
        mockBackendResponse(connection, '{"TEST": "This is a test", "TEST2": "This is another test"}');

        // this will request the translation from downloaded translations without making a request to the backend
        intlService.getAsync('TEST2').subscribe((res: string) => {
            expect(res).toEqual('This is another test');
        });
    });

    it('should fallback to the default language', () => {
        intlService.use('fr');

        intlService.setDefaultLang('en');
        intlService.setTranslation('en', {'TEST': 'This is a test'});

        intlService.getAsync('TEST').subscribe((res: string) => {
            expect(res).toEqual('This is a test');
            expect(intlService.getDefaultLang()).toEqual('en');
        });

        mockBackendResponse(connection, '{}');
    });

    it(`should return undefined when it doesn't find a translation`, () => {
        intlService.use('en');

        intlService.getAsync('TEST').subscribe((res: string) => {
            expect(res).toBeUndefined();
        });

        mockBackendResponse(connection, '{}');
    });

    it(`should return undefined when you haven't defined any translation`, () => {
        intlService.getAsync('TEST').subscribe((res: string) => {
            expect(res).toBeUndefined();
        });
    });

    it('should return an empty value', () => {
        intlService.setDefaultLang('en');
        intlService.setTranslation('en', {'TEST': ''});

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

        intlService.getAsync('TEST.TEST').subscribe((res: string) => {
            expect(res).toEqual('This is a test');
        });

        mockBackendResponse(connection, '{"TEST": {"TEST": "This is a test"}, "TEST2": {"TEST2": {"TEST2": "This is another test"}}}');

        intlService.getAsync('TEST2.TEST2.TEST2').subscribe((res: string) => {
            expect(res).toEqual('This is another test');
        });
    });

    it(`shouldn't override the translations if you set the translations twice `, (done: Function) => {
        intlService.setTranslation('en', {'TEST': 'This is a test'}, true);
        intlService.setTranslation('en', {'TEST2': 'This is a test'}, true);
        intlService.use('en');

        intlService.getAsync('TEST').subscribe((res: string) => {
            expect(res).toEqual('This is a test');
            expect(connection).not.toBeDefined();
            done();
        });
    });

    it(`shouldn't do a request to the backend if you set the translation yourself`, (done: Function) => {
        intlService.setTranslation('en', {'TEST': 'This is a test'});
        intlService.use('en');

        intlService.getAsync('TEST').subscribe((res: string) => {
            expect(res).toEqual('This is a test');
            expect(connection).not.toBeDefined();
            done();
        });
    });

    it('should be able to get instant translations', () => {
        intlService.setTranslation('en', {'TEST': 'This is a test'});
        intlService.use('en');

        expect(intlService.get('TEST')).toEqual('This is a test');
    });

    it('should return the key if instant translations are not available', () => {
        intlService.setTranslation('en', {'TEST': 'This is a test'});
        intlService.use('en');

        expect(intlService.get('TEST2')).toBeUndefined();
    });

    it('should trigger an event when the lang changes', () => {
        let tr = {'TEST': 'This is a test'};
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

        // mock response after the xhr request, otherwise it will be undefined
        mockBackendResponse(connection, '{"TEST": "This is a test"}');
    });
});

// describe('TranslateLoader', () => {
//     let injector: Injector;
//     let backend: MockBackend;
//     let translate: IntlService;
//     let connection: MockConnection; // this will be set when a new connection is emitted from the backend.

//     var prepare = (_injector: Injector) => {
//         backend = _injector.get(XHRBackend);
//         translate = _injector.get(IntlService);
//         // sets the connection when someone tries to access the backend with an xhr request
//         backend.connections.subscribe((c: MockConnection) => connection = c);
//     };

//     it('should be able to provide TranslateStaticLoader', () => {
//         TestBed.configureTestingModule({
//             imports: [HttpModule, IntlModule.forRoot()],
//             providers: [
//                 {provide: XHRBackend, useClass: MockBackend}
//             ]
//         });
//         injector = getTestBed();
//         prepare(injector);

//         expect(translate).toBeDefined();
//         expect(translate.currentLoader).toBeDefined();
//         expect(translate.currentLoader instanceof TranslateStaticLoader).toBeTruthy();

//         // the lang to use, if the lang isn't available, it will use the current loader to get them
//         translate.use('en');

//         // this will request the translation from the backend because we use a static files loader for IntlService
//         translate.getAsync('TEST').subscribe((res: string) => {
//             expect(res).toEqual('This is a test');
//         });

//         // mock response after the xhr request, otherwise it will be undefined
//         mockBackendResponse(connection, '{"TEST": "This is a test"}');
//     });

//     it('should be able to provide any TranslateLoader', () => {
//         class CustomLoader implements TranslateLoader {
//             getTranslation(lang: string): Observable<any> {
//                 return Observable.of({"TEST": "This is a test"});
//             }
//         }
//         TestBed.configureTestingModule({
//             imports: [HttpModule, IntlModule.forRoot({provide: TranslateLoader, useClass: CustomLoader})],
//             providers: [
//                 {provide: XHRBackend, useClass: MockBackend}
//             ]
//         });
//         injector = getTestBed();
//         prepare(injector);

//         expect(translate).toBeDefined();
//         expect(translate.currentLoader).toBeDefined();
//         expect(translate.currentLoader instanceof CustomLoader).toBeTruthy();

//         // the lang to use, if the lang isn't available, it will use the current loader to get them
//         translate.use('en');

//         // this will request the translation from the CustomLoader
//         translate.getAsync('TEST').subscribe((res: string) => {
//             expect(res).toEqual('This is a test');
//         });
//     });

// });

