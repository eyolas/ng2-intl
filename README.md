Ng2 Intl
==========

Inspired by [ng2-translate][] (setup is similary) and [react-intl][] (same api)


Internationalize [Angular2][] apps. This library provides angular2 components, pipe and an API to format dates, numbers, and strings, including pluralization and handling translations.

[![npm Version][npm-badge]][npm]
[![Dependency Status][david-badge]][david]

Overview
--------

**Ng2 Intl use [FormatJS][].** It provides bindings to angular 2 via its components, pipe and API.

## Features

- Display numbers with separators.
- Display dates and times correctly.
- Display dates relative to "now".
- Pluralize labels in strings.
- Support for 150+ languages.
- Runs in the browser and Node.js.
- Built on standards.

## Installation
First you need to install the npm module:
```sh
npm install ng2-intl --save
```

## Usage
#### 1. Import the `IntlModule`:
Finally, you can use ng2-intl in your Angular 2 project.
It is recommended to import `IntlModule.forRoot()` in the NgModule of your application.


The `forRoot` method is a convention for modules that provide a singleton service (such as the Angular 2 Router), you can also use it to configure the `IntlModule` loader. By default it will use the `IntlStaticLoader`, but you can provide another loader instead as a parameter of this method (see below [Write & use your own loader](#write--use-your-own-loader)).

For now ng2-intl requires HttpModule from `@angular/http` (this will change soon).


```ts
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {IntlModule} from 'ng2-intl';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        IntlModule.forRoot()
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```

If you have multiple NgModules and you use one as a shared NgModule (that you import in all of your other NgModules), don't forget that you can use it to export the `IntlModule` that you imported in order to avoid having to import it multiple times.

```ts
@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        IntlModule.forRoot()
    ],
    exports: [BrowserModule, HttpModule, IntlModule],
})
export class SharedModule {
}
```

By default, only the `IntlStaticLoader` is available. It will search for files in i18n/*.json, if you want you can customize this behavior by changing the default prefix/suffix:

```ts
@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        IntlModule.forRoot({ 
          provide: IntlLoader,
          useFactory: (http: Http) => new IntlStaticLoader(http, '/assets/i18n', '.json'),
          deps: [Http]
        })
    ],
    exports: [BrowserModule, HttpModule, IntlModule],
})
export class SharedModule {
}
```

#### 2. Init the `IntlService` for your application:

```ts
import {Component} from '@angular/core';
import {IntlService} from 'ng2-intl';

@Component({
    selector: 'app',
    template: `
        <div>{{ 'HELLO' | formattedMessage:{values: param} }}</div>
    `
})
export class AppComponent {
    param: string = "world";

    constructor(intlService: IntlService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        intlService.setDefaultLang('en');
		
		// initialize the download of the default lang
		intlService.start();

         // the lang to use, if the lang isn't available, it will use the current loader to get them
        intlService.use('fr');
    }
}
```

#### Write & use your own loader
If you want to write your own loader, you need to create a class that implements `IntlLoader`.
The only required method is `getTranslation` that must return an `Observable`. If your loader is synchronous, just use `Observable.of` to create an observable from your static value.

##### Example
```ts
class CustomLoader implements IntlLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of({"KEY": "Value"});
    }
}
```

Once you've defined your loader, you can provide it in your NgModule by adding it to its `providers` property.
Don't forget that you have to import `IntlModule` as well:
```ts
@NgModule({
    imports: [
        BrowserModule,
        IntlModule.forRoot({ provide: IntlLoader, useClass: CustomLoader })
    ],
    exports: [IntlModule],
})
export class SharedModule {
}
```

#### How to handle missing translations
You can setup a provider for `MissingTranslationHandler` in the bootstrap of your application (recommended), or in the `providers` property of a component.
It will be called when the requested translation is not available.
The only required method is `handle` where you can do whatever you want. If this method returns a value or an observable (that should return a string), then this will be used.
Just don't forget that it will be called synchronously from the `instant` method.

##### Example:
Create a Missing Translation Handler
```ts
import {MissingTranslationHandler, MissingTranslationHandlerParams} from 'ng2-intl';

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
      return 'some value';
  }
}
```

Setup the Missing Translation Handler in your NgModule (recommended) by adding it to its `providers` property:
```ts
{ provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler }
```


[npm]: https://www.npmjs.org/package/ng2-intl
[npm-badge]: https://img.shields.io/npm/v/ng2-intl.svg?style=flat-square
[david]: https://david-dm.org/eyolas/ng2-intl
[david-badge]: https://img.shields.io/david/eyolas/ng2-intl.svg?style=flat-square
[travis]: https://travis-ci.org/eyolas/ng2-intl
[travis-badge]: https://img.shields.io/travis/eyolas/ng2-intl/master.svg?style=flat-square
[Angular2]: https://angular.io/
[ng2-translate]: https://github.com/ocombe/ng2-translate
[react-intl]: https://github.com/yahoo/react-intl
[FormatJS]: http://formatjs.io/
[FormatJS GitHub]: http://formatjs.io/github/
[Documentation]: https://github.com/eyolas/ng2-intl/wiki
[Getting Started]: https://github.com/eyolas/ng2-intl/wiki#getting-started
[Examples]: https://github.com/eyolas/ng2-intl/tree/master/examples
[CONTRIBUTING]: https://github.com/eyolas/ng2-intl/blob/master/CONTRIBUTING.md
[LICENSE file]: https://github.com/eyolas/ng2-intl/blob/master/LICENSE.md
