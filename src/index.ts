export * from './pipes';
export * from './components';
export * from './services';
export * from './locale-data-registry';

export * from './intl.module';
export * from './interfaces';


import defaultLocaleData from './en';
import {addLocaleData} from './locale-data-registry';

addLocaleData(defaultLocaleData);
