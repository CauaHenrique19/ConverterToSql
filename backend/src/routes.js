const express = require('express')
const routes = express.Router()

const ConvertDataToSql = require('./utils/ConvertJsonDataToSql')
const ConvertCsvDataToSql = require('./utils/ConvertCsvDataToSql')

const convertDataToSql = new ConvertDataToSql()
const convertCsvDataToSql = new ConvertCsvDataToSql()

routes.post('/json', convertDataToSql.convert)
routes.post('/csv', convertCsvDataToSql.convert)

module.exports = routes