const Router = require('express')
const ProjectController = require('../controller/project.controller')
const router = new Router()


router.post('/', ProjectController.create)
router.get('/:userId', ProjectController.getAll)
router.get('/', ProjectController.getOne)
router.delete('/', ProjectController.delete)


module.exports = router
