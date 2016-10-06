const ESCAPED_CHARS = {
    '&' : '&amp;',
    '>' : '&gt;',
    '<' : '&lt;',
    '"' : '&quot;',
    '\'': '&#x27;',
};

const UNSAFE_CHARS_REGEX = /[&><"']/g;

export function escape(str) {
    return ('' + str).replace(UNSAFE_CHARS_REGEX, (match) => ESCAPED_CHARS[match]);
}

export function filterProps(props: {}, whitelist: string[], defaults: {} = {}): any {
    return whitelist.reduce((filtered, name) => {
        if (props.hasOwnProperty(name)) {
            filtered[name] = props[name];
        } else if (defaults.hasOwnProperty(name)) {
            filtered[name] = defaults[name];
        }

        return filtered;
    }, {});
}
