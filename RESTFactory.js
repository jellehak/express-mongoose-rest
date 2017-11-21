const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const RESTControllerFactory = require('./RESTControllerFactory')

module.exports = function (modelName, options) {
    var model = mongoose.model(modelName)
    return factory(model, options)
};

function factory(model, options) {
    var controller = RESTControllerFactory(model, options);
    var base = ""

    // todoList Routes
    router.route(base)
        .get(controller.list)
        .post(controller.create);


    router.route(base + '/:id')
        .get(controller.read)
        .put(controller.put)
        .delete(controller.remove);

    return router
};
