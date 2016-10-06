import { Pipe, Injectable, ChangeDetectorRef } from '@angular/core';
import { IntlService, FormatService } from '../services';
import { AbstractI18nPipe } from './abstractI18n';

@Pipe({
  name: 'formattedMessage',
  pure: false // required to update the value when the promise is resolved
})
export class FormattedMessagePipe extends AbstractI18nPipe {

  constructor(intlService: IntlService, _ref: ChangeDetectorRef, formatService: FormatService) {
    super(intlService, _ref, formatService);
  }

  updateValue(key: string, interpolateParams?: Object): void {
    this.intlService.get(key).subscribe((msg: string) => {
      if (msg !== undefined) {
        this.value = this.formatService.formatMessage(msg, interpolateParams);
      } else {
        this.value = key;
      }

      this.lastKey = key;
      this._ref.markForCheck();
    });
  }
}
