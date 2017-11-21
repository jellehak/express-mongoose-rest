Description
---
    Creates default REST routes:
    GET, POST
    
    :id
    GET, PUT, DELETE

Install
---
    npm install https://github.com/jellehak/express-mongoose-rest.git

Usage
---
Simple:
    const RESTFactory = require("express-mongoose-rest")
    router.use("/api/test",RESTFactory("test")
    
Advanced: 
    const RESTFactory = require("express-mongoose-rest")
    const defaultForce = {
        //creator: 'req.user._id',
        company: 'req.user.companyId'
    }
    const defaultQuery = '{ company: req.user.companyId}'

    router.use("/api/test",
        RESTFactory("test", { hide: ['description'],populate:["owners"], query: defaultQuery, force: defaultForce}))
