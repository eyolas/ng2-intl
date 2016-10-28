export let debug:  (formatter: any, ...args: any[]) => void;
try {
  debug = require('debug')('ng2-intl');
} catch(error) {
  debug = () => {};
}

