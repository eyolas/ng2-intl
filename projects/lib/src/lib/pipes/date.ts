import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { IntlService } from '../services/intl.service';
import { FormatService } from '../services/format.service';
import { AbstractI18nPipe } from './abstractI18n';

@Pipe({
  name: 'formattedDate',
  pure: false, // required to update the value when the promise is resolved
})
export class FormattedDatePipe
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
    return query && (query instanceof Date || isFinite(query));
  }

  updateValue(query: number | Date, options?: Object): void {
    this.value = this.formatService.formatDate(query, options);

    this.lastKey = query;
    this._ref.markForCheck();
  }
}
