import { Pipe, Injectable, ChangeDetectorRef } from '@angular/core';
import { IntlService, FormatService } from '../services';
import { AbstractI18nPipe } from './abstractI18n';

@Pipe({
  name: 'formattedTime',
  pure: false // required to update the value when the promise is resolved
})
export class FormattedTimePipe extends AbstractI18nPipe {

  constructor(intlService: IntlService, _ref: ChangeDetectorRef, formatService: FormatService) {
    super(intlService, _ref, formatService);
  }

  updateValue(query: string, options?: Object): void {
    this.value = this.formatService.formatTime(query, options);
    this.lastKey = query;
    this._ref.markForCheck();
  }
}
