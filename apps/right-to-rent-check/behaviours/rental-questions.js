'use strict';

const reverseDateISO = (date) => {
  return date.replace(/T.*/, '').split('-').reverse().join('-');
};

module.exports = superclass => class extends superclass {

  locals(req, res) {
    let view = super.locals(req, res);
    const data = req.sessionModel.toJSON();
    const status = data['living-status'];
    const translate = req.translate;

    const questions = [{
      question: translate('pages.check-confirmed.table.documents'),
      answer: data['documents-check']
    }, {
      question: translate('pages.check-confirmed.table.where'),
      answer: data['rental-property-location']
    }, {
      question: translate('pages.check-confirmed.table.address'),
      answer: data['rental-property-address']
    }, {
      question: translate('pages.check-confirmed.table.persons'),
      answer: data['living-status']
    }];

    if (status === 'yes') {
      questions.push({
        question: translate('pages.check-confirmed.table.when'),
        answer: reverseDateISO(data['tenancy-start'])
      });
    } else if (status === 'no') {
      questions.push({
        question: translate('pages.check-confirmed.table.uk'),
        answer: data['tenant-in-uk']
      }, {
        question: translate('pages.check-confirmed.table.current'),
        answer: data['current-property-address']
      });
    }

    view.questions = questions;

    return view;
  }

};
