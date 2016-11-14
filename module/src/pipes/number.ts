import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { IntlService, FormatService } from '../services';
import { AbstractI18nPipe } from './abstractI18n';

@Pipe({
  name: 'formattedNumber',
  pure: false // required to update the value when the promise is resolved
})
export class FormattedNumberPipe extends AbstractI18nPipe implements PipeTransform {

  constructor(intlService: IntlService, _ref: ChangeDetectorRef, formatService: FormatService) {
    super(intlService, _ref, formatService);
  }

  isValidQuery(query: any) {
    return query && ((typeof query === 'string' && query.length > 0) || isFinite(query));
  }

  updateValue(query: any, options?: Object): void {
    this.value = this.formatService.formatNumber(query, options);
    this.lastKey = query;
    this._ref.markForCheck();
  }
}
