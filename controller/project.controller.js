const {Project} = require('../models/models')
const apiError = require('../error/api.error')

class ProjectController {
  async create(req, res) {
    const {project_name} = req.body
    const project = await Project.create({project_name})
    return res.json(project)
  }

  async getAll(req, res) {
    const projects = await Project.findAll()
    return res.json(projects)
  }

  async getOne(req, res) {

  }
}

module.exports = new ProjectController()
