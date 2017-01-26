import { Http, HttpModule } from '@angular/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { IntlService, IntlLoader, IntlStaticLoader, FormatService} from './services';
import { FormattedDatePipe, FormattedMessagePipe, FormattedNumberPipe, FormattedPluralPipe, FormattedTimePipe } from './pipes';
import { FormattedDateComponent, FormattedHtmlMessageComponent, FormattedMessageComponent,
  FormattedNumberComponent, FormattedPluralComponent, FormattedTimeComponent } from './components';

export function i18nLoaderFactory(http: Http) {
  return new IntlStaticLoader(http);
}

@NgModule({
  imports: [HttpModule],
  declarations: [
    FormattedDatePipe, FormattedMessagePipe, FormattedNumberPipe, FormattedPluralPipe, FormattedTimePipe,
    FormattedDateComponent, FormattedHtmlMessageComponent, FormattedMessageComponent, FormattedNumberComponent,
    FormattedPluralComponent, FormattedTimeComponent
  ],
  providers: [FormatService],
  exports: [
    HttpModule,
    FormattedDatePipe, FormattedMessagePipe, FormattedNumberPipe, FormattedPluralPipe, FormattedTimePipe,
    FormattedDateComponent, FormattedHtmlMessageComponent, FormattedMessageComponent, FormattedNumberComponent,
    FormattedPluralComponent, FormattedTimeComponent
  ]
})
export class IntlModule {
  static forRoot(providedLoader: any = {
    provide: IntlLoader,
    useFactory: i18nLoaderFactory,
    deps: [Http]
  }): ModuleWithProviders {
    return {
      ngModule: IntlModule,
      providers: [providedLoader, IntlService]
    };
  }
}
