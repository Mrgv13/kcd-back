const Router = require('express')
const ProjectController = require('../controller/project.controller')
const router = new Router()


router.post('/', ProjectController.create)
router.get('/', ProjectController.getAll)
router.get('/:id')


module.exports = router
