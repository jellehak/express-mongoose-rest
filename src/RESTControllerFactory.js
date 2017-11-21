const _ = require("lodash")

module.exports = function Factory(Model, options) {

  const mongoose = require('mongoose')

  return {
    list: list,
    create: create,
    read: read,
    put: put,
    remove: remove
  }

  async function list(req, res) {
    try {
      //Process options.query
      var query
      if (options && options.query) {
        if (typeof options.query === 'string') query = eval('(' + options.query + ')');
        else if (typeof options.query !== 'object') query = options.query;
      }
      //var query = eval( '(' + options.query + ')')
      //console.log(options.query, query, req.user.companyId)

      var result = await Model
        .find(query)
        .populate(options.populate)
        .select(generateHiddenFields(options))
      res.json(result)
    } catch (err) { res.json({ success: false, message: err.message }) }
  };


  async function create(req, res) {
    try {
      var req_data = epureRequest(req, options)
      console.log(req_data)

      var new_task = new Model(req.body);

      var result = await new_task.save();
      res.json(result)
    } catch (err) {
      res.json({ success: false, message: err.message })
    }
  };

  //:id
  async function read(req, res) {
    try {
      var result = await Model.findById(req.params.id)
      res.json(result);
    } catch (err) {
      res.json({ success: false, message: err.message })
    }
  };

  //:id
  async function put(req, res) {
    try {
      //Force
      var req_data = epureRequest(req, options)
      //console.log(req_data)

      var result = await Model.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      res.json(task);
    } catch (err) {
      res.json({ success: false, message: err.message })
    }
  };

  //:id
  async function remove(req, res) {
    try {
      var result = await Model.remove({
        _id: req.params.id
      })
      res.json({ message: 'Item successfully deleted' })
    } catch (err) {
      res.json({ success: false, message: err.message })
    }
  };


  //---------------
  // Private
  //---------------
  function generateHiddenFields(options) {
    var hidden_fields = {};

    if (!options || typeof options.hide == 'undefined')
      return {};

    options.hide.forEach(function (dt) {
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

    if (options === null || (typeof options.hide == 'undefined'
      && typeof options.readOnly == 'undefined' && typeof options.force == 'undefined'))
      return req_data;

    for (var key in options.force) {
      req_data[key] = eval('(' + options.force[key] + ')');
    }

    var hidden_fields = _.union(options.hide, options.readOnly);
    _.each(req_data, function (num, key) {
      _.each(hidden_fields, function (fi) {
        if (fi == key)
          delete req_data[key];
      });
    });

    return req_data;
  };


}

