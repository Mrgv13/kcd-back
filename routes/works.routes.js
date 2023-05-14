const Router = require('express')
const WorksController = require('../controller/works.controller')
const router = new Router()

router.post('/', WorksController.create)
router.get('/', WorksController.getAll)
router.get('/:id', WorksController.getOne)
router.delete('/', WorksController.delete)


module.exports = router
