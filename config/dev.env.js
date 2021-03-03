'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  HTTP_PATH: '"http://localhost/"',
  APIPATH: '"https://vue-course-api.hexschool.io"',
  CUSTOMPATH: '"reborn"',
  // 注意：這邊是一對單引號，裡面再包一對雙引號喔~
})

