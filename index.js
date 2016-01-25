var Linkedin = require('node-linkedin')(),
    _ = require('lodash'),
    util = require('./util.js');

var pickInputs = {
        { key: 'id', validate: { req: true } },
        'additional_fields': { key: 'additional_fields', type: 'array' }
    };

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var linkedIn = Linkedin.init(dexter.provider('linkedin').credentials('access_token')),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        if (validateErrors)
            return this.fail(validateErrors);

        linkedIn.companies.company(inputs.id, function(err, data) {
            if (err || (data && data.errorCode !== undefined))
                this.fail(err || (data.message || 'Error Code: '.concat(data.errorCode)));
            else
                this.complete(_.merge(_.pick(data, ['id', 'name']), { additional_fields: _.pick(data, inputs.additional_fields) }));

        }.bind(this));
    }
};
