'use strict';

module.exports = key => superclass => class extends superclass {

  getTitle(route, lookup, fields, locals) {
    let custom;
    if (key && locals.values[key]) {
      custom = lookup(`pages.${route}.header.${locals.values[key]}`);
    }
    return custom || super.getTitle.apply(this, arguments);
  }

};
