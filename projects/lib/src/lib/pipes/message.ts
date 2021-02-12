import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { IntlService } from '../services/intl.service';
import { FormatService } from '../services/format.service';
import { AbstractI18nPipe } from './abstractI18n';
import { MessageDescriptor } from '../interfaces';

@Pipe({
  name: 'formattedMessage',
  pure: false, // required to update the value when the promise is resolved
})
export class FormattedMessagePipe
  extends AbstractI18nPipe
  implements PipeTransform {
  constructor(
    intlService: IntlService,
    _ref: ChangeDetectorRef,
    formatService: FormatService
  ) {
    super(intlService, _ref, formatService);
  }

  isValidQuery(query: any) {
    return (
      query &&
      ((typeof query === 'string' && query.length > 0) ||
        (typeof query === 'object' && query.id))
    );
  }

  updateValue(
    descriptor: string | MessageDescriptor,
    interpolateParams: any = {}
  ): void {
    const values = interpolateParams.values ? interpolateParams.values : {};

    if (typeof descriptor === 'string') {
      descriptor = { id: descriptor };
      if (interpolateParams['defaultMessage']) {
        descriptor.defaultMessage = interpolateParams['defaultMessage'];
      }
    }

    this.formatService
      .formatMessageAsync(descriptor, values)
      .subscribe((msg: string | undefined) => {
        if (typeof msg === 'string') {
          this.value = msg;
          this.lastKey = descriptor;
          this._ref.markForCheck();
        }
      });
  }
}
