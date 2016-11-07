export * from './src/pipes';
export * from './src/components';
export * from './src/services';
export * from './src/locale-data-registry';

export * from './src/intl.module';
export * from './src/interfaces';


import defaultLocaleData from './src/en';
import {addLocaleData} from './src/locale-data-registry';

addLocaleData(defaultLocaleData);
