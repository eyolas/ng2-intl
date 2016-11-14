import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { IntlService, FormatService } from '../services';
import { AbstractI18nPipe } from './abstractI18n';

@Pipe({
  name: 'formattedPlural',
  pure: false // required to update the value when the promise is resolved
})
export class FormattedPluralPipe extends AbstractI18nPipe implements PipeTransform {

  constructor(intlService: IntlService, _ref: ChangeDetectorRef, formatService: FormatService) {
    super(intlService, _ref, formatService);
  }

  isValidQuery(query: any) {
    return query && (typeof query === 'string' && query.length > 0);
  }

  updateValue(query: any, options?: Object): void {
    this.value = this.formatService.formatPlural(query, options);

    this.lastKey = query;
    this._ref.markForCheck();
  }
}
