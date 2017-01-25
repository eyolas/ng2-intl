import { Injectable, Optional, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { IntlLoader } from './intl.loader';
import { debug } from '../debug';
import get from 'lodash/get';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/toArray';

export interface LangChangeEvent {
  lang: string;
  messages: any;
}

export abstract class MissingTranslationHandler {
  /**
   * A function that handles missing messages.
   * @param key the missing key
   * @returns {any} a value or an observable
   * If it returns a value, then this value is used.
   * If it return an observable, the value returned by this observable will be used (except if the method was "instant").
   * If it doesn't return then the key will be used as a value
   */
  abstract handle(key: string): any;
}


@Injectable()
export class IntlService {
  /**
    * The lang currently used
    */
  public currentLang: string = this.defaultLang;

  /**
   * An EventEmitter to listen to lang change events
   * onLangChange.subscribe((params: LangChangeEvent) => {
   *     // do something
   * });
   * @type {ng.EventEmitter<LangChangeEvent>}
   */
  public onLangChange: EventEmitter<LangChangeEvent> = new EventEmitter<LangChangeEvent>();

  private pending: any;
  private messages: any = {};
  private defaultLang: string;
  private defaultFormat: any = {};
  private langs: Array<string> = [];

  constructor(public currentLoader: IntlLoader, @Optional() private missingTranslationHandler: MissingTranslationHandler) {
  }

  /**
     * Sets the default language to use as a fallback
     * @param lang
     */
  public setDefaultLang(lang: string): void {
    this.defaultLang = lang;
  }

  /**
     * Gets the default language used
     * @returns string
     */
  public getDefaultLang(): string {
    return this.defaultLang;
  }

  public start() {
    if (typeof this.messages[this.defaultLang] === 'undefined') {
      // not available, ask for it
      this.getTranslation(this.defaultLang);
      if (!this.currentLang) {
        this.currentLang = this.defaultLang;
      }
    }
  }

  /**
   * Changes the lang currently used
   * @param lang
   * @returns {Observable<*>}
   */
  public use(lang: string): Observable<any> {
    let pending: Observable<any>;
    // check if this language is available
    if (typeof this.messages[lang] === 'undefined') {
      // not available, ask for it
      pending = this.getTranslation(lang);
    }

    if (typeof pending !== 'undefined') {
      // on init set the currentLang immediately
      if (!this.currentLang) {
        this.currentLang = lang;
      }
      pending.subscribe((res: any) => {
        this.changeLang(lang);
      });

      return pending;
    } else { // we have this language, return an Observable
      this.changeLang(lang);

      return Observable.of(this.messages[lang]);
    }
  }

  /**
   * Gets an object of messages for a given language with the current loader
   * @param lang
   * @returns {Observable<*>}
   */
  public getTranslation(lang: string): Observable<any> {
    this.pending = this.currentLoader.getMessages(lang).share();
    this.pending.subscribe((res: Object) => {
      this.messages[lang] = res;
      this.updateLangs();
    }, (err: any) => {
      throw err;
    }, () => {
      this.pending = undefined;
    });

    return this.pending;
  }

  /**
    * Manually sets an object of translations for a given language
    * @param lang
    * @param translations
    * @param shouldMerge
    */
  public setTranslation(lang: string, translations: Object, shouldMerge = false): void {
    if (shouldMerge && this.messages[lang]) {
      Object.assign(this.messages[lang], translations);
    } else {
      this.messages[lang] = translations;
    }
    this.updateLangs();
  }

  /**
     * Returns an array of currently available langs
     * @returns {any}
     */
  public getLangs(): Array<string> {
    return this.langs;
  }

  /**
* @param langs
* Add available langs
*/
  public addLangs(langs: Array<string>): void {
    langs.forEach((lang: string) => {
      if (this.langs.indexOf(lang) === -1) {
        this.langs.push(lang);
      }
    });
  }

  /**
   * Update the list of available langs
   */
  private updateLangs(): void {
    this.addLangs(Object.keys(this.messages));
  }

  /**
     * Gets the message of a key
     * @param key
     * @returns {any} the translated key
     */
  public getAsync(key: string): Observable<string | any> {
    if (!key) {
      throw new Error(`Parameter "key" required`);
    }

    let obs: Observable<string | any>;
    // check if we are loading a new translation to use
    if (this.pending) {
      obs = Observable.create((observer: Observer<string>) => {
        this.pending.subscribe((res: any) => {
          observer.next(get(res, key, undefined));
          observer.complete();
        });
      });
    } else {
      obs = Observable.of(get(this.messages[this.currentLang], key, undefined));
    }

    return Observable.create((observer: Observer<string>) => {
      obs.subscribe((res: string) => {

        if (typeof res === 'undefined' && this.defaultLang && this.defaultLang !== this.currentLang) {
          res = get(this.messages[this.defaultLang], key, undefined);

          debug(
            `[Ng Intl] Error formatting message: "${key}" for locale: "${this.currentLang}", using default message as fallback.`
          );
        }

        if (!res && this.missingTranslationHandler) {
          res = this.missingTranslationHandler.handle(key);
        }

        observer.next(res);
        observer.complete();
      });
    });
  }

  /**
    * Gets the message of a key
    * @param key
    * @returns {any} the translated key
    */
  public get(key: string): string {
    if (!key) {
      throw new Error(`Parameter "key" required`);
    }

    let res = get(this.messages[this.currentLang], key, this.messages[this.currentLang][key]);

    if (typeof res === 'undefined' && this.defaultLang && this.defaultLang !== this.currentLang) {
      res = get(this.messages[this.defaultLang], key, this.messages[this.defaultLang][key]);

      debug(
        `[Ng Intl] Error formatting message: "${key}" for locale: "${this.currentLang}", using default message as fallback.`
      );
    }

    if (!res && this.missingTranslationHandler) {
      res = this.missingTranslationHandler.handle(key);
    }

    return res;
  }

  public getConfig() {
    return {
      locale: this.currentLang,
      formats: this.defaultFormat,
      defaultLocale: this.defaultLang
    };
  }

  /**
   * Changes the current lang
   * @param lang
   */
  private changeLang(lang: string): void {
    this.currentLang = lang;
    this.onLangChange.emit({ lang: lang, messages: this.messages[lang] });
  }
}
