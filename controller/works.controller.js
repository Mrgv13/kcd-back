const {Works, WorksStatus, WorksAttributes, WorksAttributesStatus} = require('../models/models')
const ApiError = require('../error/api.error')
const e = require("express");

class WorksController {
  async create(req, res, next) {
    let work
    let workStatus
    try {
      let {work_name, date_start, date_end, price, projectId, status} = req.body
      work  = await Works.create({work_name, date_start, date_end, price, projectId})

      if (status) {
         workStatus = await WorksStatus.create( {
            complited: status.complited || false,
            text: status.text || 'нет',
            percent_complited: status.percent_complited || 12,
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
    let works2
    let arr = []

    if (!projectId) works = await Works.findAll()
    if (projectId) {
      works = await Works.findAll(
        {
          where:
            {
              projectId
            },
        })

      works.forEach(el => arr.push(el.id))
      works2 = await Works.findAll(
        {
          where:
            {
              projectId
            },
          include: [
            {
              model: WorksStatus,
              where: {workId: arr}
            },
          ]
        })
    }


      return res.json(works2)
  }

  async getOne(req, res, next) {
    const {id} = req.params
    let work
    let worksAttributes
    let arr = []
    try {
      worksAttributes = await WorksAttributes.findAll({where: {workId: id}})
      worksAttributes.forEach(el => arr.push(el.id))
      if (worksAttributes.length !== 0) {
        work = await Works.findOne(
          {
            where: {
              id: id
            },
            include: [
              {
                model: WorksStatus,
                where: {workId: id}
              },
              {
                model: WorksAttributes,
                where: {workId: id},
                include: [
                  {
                    model: WorksAttributesStatus,
                    where: {worksAttributeId: arr}
                  }
                ]
              },
            ]
          },
        )
      }

      if (worksAttributes.length === 0) {
        work = await Works.findOne(
          {
            where: {
              id: id
            },
            include: [
              {
                model: WorksStatus,
                where: {workId: id}
              }
            ]
          },
        )
      }
    } catch (error) {
      next(ApiError.badRequest(error.message))
    } finally {
      return res.json(work)
    }
  }

  async delete(req, res, next) {
    const {id} = req.query
    let arr = []
    let work
    let workStatus
    let workAttAll
    let workAtt
    let workAttSt

    try {
      workAttAll = WorksAttributes.findAll(
        {
          where:
            {
              workId: id
            }
        })

      if (!workAttAll) {
        workAttAll.forEach(el => arr.push(el.id))

        workAttSt = WorksAttributesStatus.destroy(
          {
            where: {workAttributeId: arr}
          })

        workAtt = WorksAttributes.destroy({
          where: {
            workId: id
          }
        })
      }

      workStatus  = await WorksStatus.destroy(
        {
          where:
            {
              workId: id
            }
        })

      work  = await Works.destroy(
        {
          where:
            {
              id
            }
        })

    } catch (error) {
      next(ApiError.badRequest(error.message))
    } finally {
      return res.json(true)
    }
  }

  async getCalcPercent(req, res, next) {
    const {id} = req.params
    let arr = []
    let percent = 0
    let workAtt
    let workAttSt
    let workStatus
    let workStatus2

    try {
    workAtt = await WorksAttributes.findAll({
      where:
        {
          workId: id
        }
    })

      workAtt.forEach(el => arr.push(el.id))

      workAttSt = await WorksAttributesStatus.findAll({
        where: {
          worksAttributeId: arr
        }
      })

      arr = []
      workAttSt.forEach(el => arr.push(el.percent_complited))

      arr.forEach(el => percent += el)

      percent = Math.round(percent/ arr.length)

      workStatus = await WorksStatus.update(
        {
          percent_complited: percent
        },
        {
          where: {
              workId: id
          }
        })


    } catch (error) {
      next(ApiError.badRequest(error.message))
    } finally {

    }


    return res.json(percent)
  }
}

module.exports = new WorksController()
