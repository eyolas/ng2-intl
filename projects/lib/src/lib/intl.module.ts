import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { FormatService } from './services/format.service';
import { IntlStaticLoader, IntlLoader } from './services/intl.loader';
import { IntlService } from './services/intl.service';

// Pipes
import { FormattedDatePipe } from './pipes/date';
import { FormattedMessagePipe } from './pipes/message';
import { FormattedNumberPipe } from './pipes/number';
import { FormattedPluralPipe } from './pipes/plural';
import { FormattedTimePipe } from './pipes/time';

// Components
import { FormattedDateComponent } from './components/date';
import { FormattedMessageComponent } from './components/message';
import { FormattedHtmlMessageComponent } from './components/html-message';
import { FormattedNumberComponent } from './components/number';
import { FormattedPluralComponent } from './components/plural';
import { FormattedTimeComponent } from './components/time';

export function i18nLoaderFactory(http: HttpClient) {
  return new IntlStaticLoader(http);
}

@NgModule({
  imports: [HttpClientModule],
  declarations: [
    FormattedDatePipe,
    FormattedMessagePipe,
    FormattedNumberPipe,
    FormattedPluralPipe,
    FormattedTimePipe,
    FormattedDateComponent,
    FormattedMessageComponent,
    FormattedHtmlMessageComponent,
    FormattedNumberComponent,
    FormattedPluralComponent,
    FormattedTimeComponent,
  ],
  providers: [FormatService],
  exports: [
    HttpClientModule,
    FormattedDatePipe,
    FormattedMessagePipe,
    FormattedNumberPipe,
    FormattedPluralPipe,
    FormattedTimePipe,
    FormattedDateComponent,
    FormattedMessageComponent,
    FormattedHtmlMessageComponent,
    FormattedNumberComponent,
    FormattedPluralComponent,
    FormattedTimeComponent,
  ],
})
export class IntlModule {
  static forRoot(
    providedLoader: any = {
      provide: IntlLoader,
      useFactory: i18nLoaderFactory,
      deps: [HttpClient],
    }
  ): ModuleWithProviders<IntlModule> {
    return {
      ngModule: IntlModule,
      providers: [providedLoader, IntlService],
    };
  }
}
