const { Works, Project, UserProject, User} = require('../models/models')
const ApiError = require("../error/api.error");

class ProjectController {
  async create(req, res, next) {

    let project
    try {
      const {project_name, userId} = req.body
      const user = await User.findOne({ where: {id: userId}})
      if (!user)  {
        throw "user not found"
      } else {
        project = await Project.create({project_name})
        const user_project = UserProject.create({projectId: project.id, userId})
      }
    } catch (error){
      next(ApiError.badRequest(error))
    } finally {
      return res.json(project)
    }
  }

  async getAll(req, res, next) {
    const {userId} = req.params
    let user_project
    let projects
    let arr = []
    try {
      user_project = await UserProject.findAll(
        {
          where: {userId},
        },
      )

      user_project.forEach(element => {
        arr.push(element.projectId)
      })

      projects = await Project.findAll(
        {
          where: {
            id: arr
          },
          include: [
            {
              model: Works,
              where: {projectId: arr, }
            },
          ],
        })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    } finally {
      return res.json(projects)
    }
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
          include: [
            {
            model: Works,
            where: {projectId: id}
            },
          ],

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
