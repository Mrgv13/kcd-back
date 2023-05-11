const {Works, WorksStatus} = require('../models/models')
const ApiError = require('../error/api.error')

class WorksController {
  async create(req, res, next) {
    let work
    let workStatus
    try {
      let {work_name, date_start, date_end, price, projectId, status} = req.body
      work  = await Works.create({work_name, date_start, date_end, price, projectId})

      if (status) {
         workStatus = await WorksStatus.create( {
            complited: status.complited,
            text: status.text,
            percent_complited: status.percent_complited,
            workId: work.id,
          })
      }

      if (!status) {
        workStatus = await WorksStatus.create( {
          complited: false,
          text: "нет",
          percent_complited: 0,
          workId: work.id,
        })
      }

    } catch (error) {
      next(ApiError.badRequest(error.message))
    } finally {
      return res.json(work)
    }
  }

  async getAll(req, res) {
    const {projectId} = req.query
    let works
    if (!projectId) works = await Works.findAll()
    if (projectId) works = await Works.findAll({where: {projectId}})

    return res.json(works)
  }

  async getOne(req, res, next) {
    const {id} = req.params
    let work
    try {
      work = await Works.findOne(
        {
          where: {
            id: id
          },
          include: [{
            model: WorksStatus,
            where: {workId: id}
          }]
        },
      )
    } catch (error) {
      next(ApiError.badRequest(error.message))
    } finally {
      return res.json(work)
    }
  }
}

module.exports = new WorksController()
