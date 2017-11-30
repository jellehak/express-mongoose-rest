const _ = require("lodash")
const mongoose = require('mongoose')


module.exports = function Factory(modelName, options) {

    var Model = mongoose.model(modelName)

    //Default options
    var options = (options ? options : {})
        // console.log(options)

    //Flat list options
    var populate = options.populate || []

    return {
        list: list,
        create: create,
        read: read,
        put: put,
        remove: remove
    }

    //---------
    // Methods
    //---------

    async function list(req, res) {
        try {
            //Process options.query
            var query
            if (options && options.query) {
                if (typeof options.query === 'string') query = eval('(' + options.query + ')');
                else if (typeof options.query !== 'object') query = options.query;
            }

            var result = await Model
                .find(query)
                .populate(populate)
                .select(generateHiddenFields(options))
                .exec() //Make it a real promise

            res.json(result)
        } catch (err) { res.json({ success: false, message: err.message }) }
    };


    async function create(req, res) {
        try {
            var req_data = epureRequest(req, options)
            var new_task = new Model(req_data);
            var result = await new_task.save();
            res.json(result)
        } catch (err) { res.json({ success: false, message: err.message }) }
    };

    //:id
    async function read(req, res) {
        try {
            var result = await Model.findById(req.params.id)
                .populate(populate)
                .select(generateHiddenFields(options))

            res.json(result);
        } catch (err) { res.json({ success: false, message: err.message }) }
    };

    //:id
    async function put(req, res) {
        try {
            var req_data = epureRequest(req, options)
            var result = await Model.findOneAndUpdate({ _id: req.params.id }, req_data, { new: true })
            res.json(result);
        } catch (err) { res.json({ success: false, message: err.message }) }
    };

    //:id
    async function remove(req, res) {
        try {
            var result = await Model.remove({
                _id: req.params.id
            })
            res.json({ message: 'Item successfully deleted' })
        } catch (err) { res.json({ success: false, message: err.message }) }
    };


    //---------------
    // Private
    //---------------
    function generateHiddenFields(options) {
        var hidden_fields = {};

        if (!options || typeof options.hide == 'undefined')
            return {};

        options.hide.forEach(function(dt) {
            hidden_fields[dt] = false;
        });
        return hidden_fields;
    };


    /** Sec issue
     * Epure incoming data to avoid overwritte and POST request forgery
     * and disallows writing to read-only fields
     */
    function epureRequest(req, options) {
        var req_data = req.body;

        if (options === null || (typeof options.hide == 'undefined' &&
                typeof options.readOnly == 'undefined' && typeof options.force == 'undefined'))
            return req_data;

        for (var key in options.force) {
            req_data[key] = eval('(' + options.force[key] + ')');
        }

        var hidden_fields = _.union(options.hide, options.readOnly);
        _.each(req_data, function(num, key) {
            _.each(hidden_fields, function(fi) {
                if (fi == key)
                    delete req_data[key];
            });
        });

        return req_data;
    };


}