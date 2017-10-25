'use strict';

const _ = require('lodash');

module.exports = superclass => class extends superclass {

  getBackLink(req, res) {
    let getBackLink = super.getBackLink(req, res);
    if (_.includes(['manual', 'address', 'lookup'], req.query.step)) {
      getBackLink = req.path;
    }
    return getBackLink;
  }
};
