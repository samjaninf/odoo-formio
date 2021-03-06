// Copyright 2018 Nova Code (http://www.novacode.nl)
// See LICENSE file for full licensing details.

odoo.define('formio.Form', ['web.ajax'], function (require) {
    "use strict";

    var ajax = require('web.ajax');

    $(document).ready(function() {
        var form_id = document.getElementById('form_id').value,
            schema_url = '/formio/form/schema/' + form_id,
            data_url = '/formio/form/data/' + form_id,
            submit_url = '/formio/form/submit/' + form_id,
            schema = {};

        ajax.jsonRpc(schema_url, 'call', {}).then(function(result) {
            if (!$.isEmptyObject(result)) {
                schema = JSON.parse(result);

                //Formio.icons = 'fontawesome';
                Formio.createForm(document.getElementById('formio_form'), schema).then(function(form) {
                    // Events
                    form.on('submit', function(form_obj) {
                        ajax.jsonRpc(submit_url, 'call', {
                            'form_id': form_id,
                            'data': form_obj.data
                        }).then(function () {
                            // TODO Come with a better approach, instead of the setTimeout.
                            console.log('Form.io: submitted form');
                            setTimeout(function () {
                                window.location.reload();
                            }, 500);
                        });
                    });

                    // Set the Submission (data)
                    // https://github.com/formio/formio.js/wiki/Form-Renderer#setting-the-submission
                    ajax.jsonRpc(data_url, 'call', {}).then(function(result) {
                        if (!$.isEmptyObject(result)) {
                            form.submission = {'data': JSON.parse(result)};
                        }
                    });
                });
            }
        });
    });
});
