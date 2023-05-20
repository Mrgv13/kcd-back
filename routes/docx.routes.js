const Router = require('express')
const DocxController = require('../controller/docx.controller')
const router = new Router()


router.post('/', DocxController.create)


module.exports = router
