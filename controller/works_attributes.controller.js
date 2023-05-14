const {WorksAttributes, WorksAttributesStatus} = require("../models/models");
const ApiError = require('../error/api.error')

class Works_attributesController {
  async create(req, res, next) {
    let works_attributes

    try {
      const {work_name, date_start, date_end, price, workId, status} = req.body
      if (!workId) throw "workID is empty"
      let worksAttributesStatus
      works_attributes = await WorksAttributes.create({work_name, date_start, date_end, price, workId})

      if (status) {
        worksAttributesStatus = await WorksAttributesStatus.create( {
          complited: status.complited,
          text: status.text,
          percent_complited: status.percent_complited,
          worksAttributeId: works_attributes.id,
        })
      }

      if (!status) {
        worksAttributesStatus = await WorksAttributesStatus.create( {
          complited: false,
          text: "нет",
          percent_complited: 0,
          worksAttributeId: works_attributes.id,
        })
      }

    } catch (error){
      next(ApiError.badRequest(error))
    }
    finally {
      return res.json(works_attributes)
    }
  }

  async getAll(req, res, next) {
    const {workId} = req.query
    let works_attributes
    let works_attributes2
    let arr = []

    try {

      if (!workId) throw "bad id"

      if (workId) {
        if (workId) works_attributes = await WorksAttributes.findAll(
          {
            where:
              {
                workId
              },
          })

        works_attributes.forEach(el => arr.push(el.id))

        works_attributes2 = await WorksAttributes.findAll(
          {
            where:
              {
                workId
              },
            include: [{
              model: WorksAttributesStatus,
              where: {
                worksAttributeId: arr
              }
            }]
          })
      }
    } catch (e) {
      next(ApiError.badRequest(e))
    } finally {
      res.json(works_attributes2)
    }
  }

  async getOne(req, res, next) {
    const {id} = req.params

    let works_attributes
    try {
      works_attributes = await WorksAttributes.findOne(
        {
          where: {
            id: id
          },
          include: [{
            model: WorksAttributesStatus,
            where: {workAttributeId: id}
          }]
        },
      )
    } catch (error) {
      next(ApiError.badRequest(error.message))
    } finally {
      return res.json(works_attributes)
    }
  }

  async delete(req, res, next) {
    const {id} = req.params

    let works_attributes
    let works_attributes_status
    try {

      works_attributes_status = await WorksAttributesStatus.destroy({
        where: {
          worksAttributeId: id
        }
      })

      works_attributes = await WorksAttributes.destroy(
        {
          where: {
            id: id
          },
        },
      )
    } catch (error) {
      next(ApiError.badRequest(error.message))
    } finally {
      return res.json(true)
    }
  }

  async update(req, res, next) {
    const {id} = req.params
    const {work_name, date_start, date_end, price, percent_complited} = req.body

    let works_attributes
    let works_attributes_status

    try {
      works_attributes_status = await WorksAttributesStatus.update(
        {
          percent_complited: percent_complited
        },
        {
        where: {
          worksAttributeId: id
        }
      })

      works_attributes = await WorksAttributes.update(
        {
          work_name: work_name,
          date_start: date_start,
          date_end: date_end,
          price: price
        },
        {
          where: {
            id: id
          },
        },
      )

    } catch (error) {
      next(ApiError.badRequest(error.message))
    } finally {
      return res.json(work_name)
    }
  }
}

module.exports = new Works_attributesController()
