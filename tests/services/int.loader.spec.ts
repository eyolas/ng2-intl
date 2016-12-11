import {Injector} from '@angular/core';
import {ResponseOptions, Response, XHRBackend, HttpModule} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import { Observable } from 'rxjs';
import {
  IntlModule,
  IntlService,
  IntlLoader,
  IntlStaticLoader
} from './../../module';

import {getTestBed, TestBed} from '@angular/core/testing';

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};


describe('IntlLoader', () => {
    let injector: Injector;
    let backend: MockBackend;
    let translate: IntlService;
    let connection: MockConnection; // this will be set when a new connection is emitted from the backend.

    let prepare = (_injector: Injector) => {
        backend = _injector.get(XHRBackend);
        translate = _injector.get(IntlService);
        // sets the connection when someone tries to access the backend with an xhr request
        backend.connections.subscribe((c: MockConnection) => connection = c);
    };

    it('should be able to provide IntlStaticLoader', () => {
        TestBed.configureTestingModule({
            imports: [HttpModule, IntlModule.forRoot()],
            providers: [
                {provide: XHRBackend, useClass: MockBackend}
            ]
        });
        injector = getTestBed();
        prepare(injector);

        expect(translate).toBeDefined();
        expect(translate.currentLoader).toBeDefined();
        expect(translate.currentLoader instanceof IntlStaticLoader).toBeTruthy();

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');

        // this will request the translation from the backend because we use a static files loader for IntlService
        translate.getAsync('TEST').subscribe((res: string) => {
            expect(res).toEqual('This is a test');
        });

        // mock response after the xhr request, otherwise it will be undefined
        mockBackendResponse(connection, '{"TEST": "This is a test"}');
    });

    it('should be able to provide any IntlLoader', () => {
        class CustomLoader implements IntlLoader {
            getMessages(lang: string): Observable<any> {
                return Observable.of({'TEST': 'This is a test'});
            }
        }
        TestBed.configureTestingModule({
            imports: [HttpModule, IntlModule.forRoot({provide: IntlLoader, useClass: CustomLoader})],
            providers: [
                {provide: XHRBackend, useClass: MockBackend}
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

