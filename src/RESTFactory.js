const express = require('express')
const mongoose = require('mongoose')
const RESTControllerFactory = require('./RESTControllerFactory')


module.exports = function factory(modelName, options) {
    let router = express.Router(); //Note its important to create a new router!
    let controller = RESTControllerFactory(modelName, options);
    let base = ""

    //console.log("New rest router created for model:", modelName, options)

    // todoList Routes
    router.route(base)
        //router
        .get(controller.list)
        .post(controller.create);


    router.route(base + '/:id')
        .get(controller.read)
        .put(controller.put)
        .post(controller.put)
        .delete(controller.remove);

    return router
};