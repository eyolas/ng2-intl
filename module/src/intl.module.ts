import { Http, HttpModule } from '@angular/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { IntlService, IntlLoader, IntlStaticLoader, FormatService} from './services';
import * as pipes from './pipes';
import * as components from './components';

export function i18nLoaderFactory(http: Http) {
  return new IntlStaticLoader(http);
}

const PIPES: any[] = Object.keys(pipes).map((k: string) => (pipes as any)[k]);
const COMPONENTS = Object.keys(components).map((k: string) => (components as any)[k]);

@NgModule({
  imports: [HttpModule],
  declarations: [
    ...PIPES,
    ...COMPONENTS
  ],
  providers: [FormatService],
  exports: [
    HttpModule,
    ...PIPES,
    ...COMPONENTS
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
