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

    } catch (error) {
      next(ApiError.badRequest(error.message))
    } finally {
      return res.json(workStatus)
    }
  }

  async getAll(req, res) {
    const {projectId} = req.query
    let works
    if (!projectId) works = await Works.findAll()
    if (projectId) works = await Works.findAll({where: {projectId}})

    return res.json(works)
  }

  async getOne(req, res) {
    const {id} = req.params
    let workStatus
    let work
    try {
      workStatus = await WorksStatus.findOne({where: {workID: {id}}})
    } catch (error) {
      console.log(error)
    }


    if (workStatus){
      work = await Works.findOne(
        {where: {id},
          include: workStatus
        },
      )
    }

    if (!workStatus){
      work = await Works.findOne(
        {where: {id}},
      )
    }




    return res.json(work)
  }
}

module.exports = new WorksController()
