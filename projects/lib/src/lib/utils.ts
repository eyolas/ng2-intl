const ESCAPED_CHARS: { [k: string]: string } = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#x27;',
};

const UNSAFE_CHARS_REGEX = /[&><"']/g;

export function escape(str: string): string {
  return ('' + str).replace(
    UNSAFE_CHARS_REGEX,
    (match) => ESCAPED_CHARS[match]
  );
}

export function filterProps(
  props: { [k: string]: any },
  whitelist: string[],
  defaults: { [k: string]: any } = {}
): any {
  return whitelist.reduce<{ [k: string]: string }>((filtered, name) => {
    if (props.hasOwnProperty(name)) {
      filtered[name] = props[name];
    } else if (defaults.hasOwnProperty(name)) {
      filtered[name] = defaults[name];
    }

    return filtered;
  }, {});
}
