const {WorksAttributes} = require("../models/models");
const ApiError = require('../error/api.error')

class Works_attributesController {
  async create(req, res, next) {
    let works_attributes

    try {
      const {works_attributes_name, date_start, date_end, workId} = req.body
      if (!workId) throw "workID is empty"

      works_attributes = await WorksAttributes.create({works_attributes_name, date_start, date_end, workId})

    } catch (error){
      next(ApiError.badRequest(error))
    }
    finally {
      return res.json(works_attributes)
    }
  }

  async getAll(req, res) {
    const {workId} = req.query
    let works_attributes
    if (!workId) works_attributes = await WorksAttributes.findAll()
    if (workId) works_attributes = await WorksAttributes.findAll({where: {workId}})
    res.json(works_attributes)
  }

  async getOne(req, res) {
    const {id} = req.params
    res.json("wa done" + id)
  }

  async check(req, res) {
    const query = req.query
    res.json(query)
  }
}

module.exports = new Works_attributesController()
