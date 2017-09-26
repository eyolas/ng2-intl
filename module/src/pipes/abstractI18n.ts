import { PipeTransform, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { IntlService, LangChangeEvent, FormatService } from '../services';
import { MessageDescriptor } from '../interfaces';

export abstract class AbstractI18nPipe implements PipeTransform, OnDestroy {
  value = '';
  lastKey: any;
  lastParams: any[];
  onLangChange: EventEmitter<LangChangeEvent>;

  constructor(protected intlService: IntlService, protected _ref: ChangeDetectorRef, protected formatService: FormatService) {
  }

  /* tslint:disable */
  /**
   * @name equals
   *
   * @description
   * Determines if two objects or two values are equivalent.
   *
   * Two objects or values are considered equivalent if at least one of the following is true:
   *
   * * Both objects or values pass `===` comparison.
   * * Both objects or values are of the same type and all of their properties are equal by
   *   comparing them with `equals`.
   *
   * @param {*} o1 Object or value to compare.
   * @param {*} o2 Object or value to compare.
   * @returns {boolean} True if arguments are equal.
   */
  private equals(o1: any, o2: any): boolean {
    if (o1 === o2) return true;
    if (o1 === null || o2 === null) return false;
    if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
    var t1 = typeof o1, t2 = typeof o2, length: number, key: any, keySet: any;
    if (t1 == t2 && t1 == 'object') {
      if (Array.isArray(o1)) {
        if (!Array.isArray(o2)) return false;
        if ((length = o1.length) == o2.length) {
          for (key = 0; key < length; key++) {
            if (!this.equals(o1[key], o2[key])) return false;
          }
          return true;
        }
      } else {
        if (Array.isArray(o2)) {
          return false;
        }
        keySet = Object.create(null);
        for (key in o1) {
          if (!this.equals(o1[key], o2[key])) {
            return false;
          }
          keySet[key] = true;
        }
        for (key in o2) {
          if (!(key in keySet) && typeof o2[key] !== 'undefined') {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }
  /* tslint:enable */

  abstract updateValue(key: any, interpolateParams?: Object, options?: Object): void;

  abstract isValidQuery(query: any): boolean;

  transform(query: string | MessageDescriptor, ...args: any[]): any {
    if (!this.isValidQuery(query)) {
      return query;
    }

    // if we ask another time for the same key, return the last value
    if (this.equals(query, this.lastKey) && this.equals(args, this.lastParams)) {
      return this.value;
    }

    let interpolateParams: Object;
    if (args.length && args[0] !== null && typeof args[0] === 'object' && !Array.isArray(args[0])) {
      interpolateParams = args[0];
    }

    let options: Object;
    if (args.length && args[1] !== null && typeof args[1] === 'object' && !Array.isArray(args[1])) {
      options = args[1];
    }

    // store the query, in case it changes
    this.lastKey = query;

    // store the params, in case they change
    this.lastParams = args;

    // set the value
    this.updateValue(query, interpolateParams, options);

    // if there is a subscription to onLangChange, clean it
    this._dispose();

    // subscribe to onLangChange event, in case the language changes
    if (!this.onLangChange) {
      this.onLangChange = this.intlService.onLangChange.subscribe((event: LangChangeEvent) => {
        if (this.lastKey) {
          this.lastKey = null; // we want to make sure it doesn't return the same value until it's been updated
          this.updateValue(query, interpolateParams);
        }
      });
    }

    return this.value;
  }

  /**
   * Clean any existing subscription to change events
   * @private
   */
  _dispose(): void {
    if (typeof this.onLangChange !== 'undefined') {
      this.onLangChange.unsubscribe();
      this.onLangChange = undefined;
    }
  }

  ngOnDestroy(): void {
    this._dispose();
  }
}
