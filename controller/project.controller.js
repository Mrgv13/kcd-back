const { Works, Project, UserProject, User} = require('../models/models')
const ApiError = require("../error/api.error");
const { Op } = require("sequelize");

class ProjectController {
  async create(req, res, next) {
    const {project_name, userId} = req.body
    let project
    try {

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
    let projects1
    let projects2
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

      projects1 = await Project.findAll(
        {
          where: {
            id: arr
          },
          include: [
            {
              model: Works,
              where: {
                projectId: arr,
              }
            },
          ],
        })

      projects2 = await Project.findAll(
        {
          where: {
            id: arr
          },
        })

    } catch (error) {
      next(ApiError.badRequest(error.message))
    } finally {

      return res.json(projects2)
    }
  }

  async getOne(req, res, next) {
    const {id} = req.query
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

      if (!project) {
        project = await Project.findOne(
          {
            where: {
              id: id
            },
          },
        )
      }

    } catch (error){
      next(ApiError.badRequest(error.message))
    } finally {
      res.json(project)
    }
  }

  async delete(req, res, next) {
    const {id} = req.query
    let project
    let work
    let work2
    let arr = []
    try {

      work = await Works.findAll(
        {
          where: {
            projectId: id
          },
        },
      )

      work.forEach(el => arr.push(el.id))

      work2 = await Works.destroy(
        {
          where: {
            id: arr
          },
        },
      )

      project = await Project.destroy(
        {
          where: {
            id: id
          },
        },
      )

    } catch (error){
      next(ApiError.badRequest(error.message))
    } finally {
      res.json(arr)
    }
  }
}

module.exports = new ProjectController()
