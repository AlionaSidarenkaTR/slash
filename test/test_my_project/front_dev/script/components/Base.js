
class Base {
    constructor({temp = '', selector}) {
        this.temp = temp;
        this.selector = selector;
    }

    get instance() {
        return document.querySelectorAll(this.selector) ?
            document.querySelectorAll(this.selector)[0] : '';
    }

    createInnerTemp(innerTemp) {
        innerTemp = Array.isArray(innerTemp) ? innerTemp.join('') : innerTemp;
        this.instance.innerHTML = innerTemp ;
    }

    addListener(subscribeEvent, callback) {
        this.instance.addEventListener(subscribeEvent, callback);
    }

    html(literals, ...substs) {
        return literals.raw.reduce((acc, lit, i) => {
            let subst = substs[i-1];

            if (Array.isArray(subst)) {
                subst = subst.join('');
            }

            if (acc.endsWith('$')) {
                subst = subst ? this._htmlEscape(subst) : '';
                acc = acc.slice(0, -1);
            }

            return `${acc}${subst}${lit}`;
        });
    }

    _htmlEscape(str) {
        return str.replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/`/g, '&#96;');
    }
}

export default Base;
