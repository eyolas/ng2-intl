import { Pipe, Injectable, ChangeDetectorRef } from '@angular/core';
import { IntlService, FormatService } from '../services';
import { AbstractI18nPipe } from './abstractI18n';
import { MessageDescriptor } from '../interfaces';

@Pipe({
  name: 'formattedMessage',
  pure: false // required to update the value when the promise is resolved
})
export class FormattedMessagePipe extends AbstractI18nPipe {

  constructor(intlService: IntlService, _ref: ChangeDetectorRef, formatService: FormatService) {
    super(intlService, _ref, formatService);
  }

  updateValue(descriptor: string | MessageDescriptor, interpolateParams: any = {}): void {
    let values = interpolateParams.values ? interpolateParams.values : {};

    if (typeof descriptor === "string") {
      descriptor = { id: descriptor };
      if (interpolateParams['defaultMessage']) {
        descriptor.defaultMessage = interpolateParams['defaultMessage'];
      }
    }

    this.formatService
      .formatMessage(descriptor, values)
      .subscribe((msg: string) => {
        this.value = msg;
        this.lastKey = descriptor;
        this._ref.markForCheck();
      });
  }
}
