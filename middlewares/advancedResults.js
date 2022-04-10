const Bootcamp = require('../models/Bootcamp')

const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    //copy rqe.query
    const reqQuery = {
        ...req.query
    }

    //array of fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    //loop over removeFields
    removeFields.forEach(param => delete reqQuery[param])

    //create query string
    let queryString = JSON.stringify(reqQuery)

    // console.log(req.query)

    //create operator like gte , gt etc
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // console.log(queryString)

    //filtering resource
    query = model.find(JSON.parse(queryString))

    //select fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(' ')
        // console.log(fields)
        query = query.select(fields)
    }

    //sorting
    if (req.query.sort) {
        const result = req.query.sort.split(',').join(' ');
        query = query.sort(result)
    } else {
        query = query.sort('-createdAt')
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = (page) * limit;
    const total = await model.countDocuments()
    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    //executing query
    const data = await query

    //paginaiton results
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit: limit
        }
    }

    res.advancedResults = {
        success: true,
        count: data.length,
        pagination,
        data: data
    }

    next()
}

module.exports = advancedResults