const { Works, Project} = require('../models/models')
const ApiError = require("../error/api.error");

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

  async getOne(req, res, next) {
    const {id} = req.params
    let project
    try {
      project = await Project.findOne(
        {
          where: {
            id: id
          },
          include: [{
            model: Works,
            where: {projectId: id}
          }]
        },
      )

    } catch (error){
      next(ApiError.badRequest(error.message))
    } finally {
      res.json(project)
    }
  }
}

module.exports = new ProjectController()
