const docx = require('docx')
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun } = docx;
const fs = require('node:fs');
const { Works, Project, UserProject, User, WorksStatus, WorksAttributes, WorksAttributesStatus} = require('../models/models')
const ApiError = require("../error/api.error");

class DocxController {
  async create(req, res, next) {
    const { userId ,projectId} = req.query
    let user_project
    let projects1
    let projects2
    let arr = []
    let arr2 = []
    let arrDoc = []
    let data = new FormData();
    const pdf = new PDFDocument;
    pdf.pipe(fs.createWriteStream('./files/sample.pdf'));
    let doc
    let result
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
              },
              include: [
                {
                  model: WorksStatus
                },
                {
                  model: WorksAttributes,
                  include: WorksAttributesStatus
                },
              ]
            },
          ],
        })

      projects1.forEach(el => {
        arrDoc.push("Название проекта:")
        arrDoc.push(el.project_name)
        arrDoc.push("\n")
        arrDoc.push("Перечень работ:")
        arrDoc.push("\n")

        el.works.forEach( (work, index) => {
          arrDoc.push(index + 1)
          arrDoc.push("Название работы:")
          arrDoc.push(work.work_name)
          arrDoc.push("\n")
          arrDoc.push("Даты:")
          arrDoc.push(work.date_start)
          arrDoc.push("по")
          arrDoc.push(work.date_end)
          arrDoc.push("\n")
          arrDoc.push("Статус:")
          arrDoc.push(work.works_status.complited ? "Завершена" : "Не завершена")
          arrDoc.push("\n")
          work.works_attributes.length !== 0 &&
          arrDoc.push("Подработы:\n") &&
          work.works_attributes.map((workAttr, index) => {
            arrDoc.push(index + 1)
            arrDoc.push("Название подработы:")
            arrDoc.push(workAttr.work_name)
            arrDoc.push("\n")
            arrDoc.push("Даты:")
            arrDoc.push(workAttr.date_start)
            arrDoc.push("по")
            arrDoc.push(workAttr.date_end)
            arrDoc.push("\n")
            arrDoc.push("Статус:")
            arrDoc.push(workAttr.works_attributes_status.complited ? "Завершена" : "Не завершена")
            arrDoc.push("\n")
            arrDoc.push("\n")
          })

          arrDoc.push("\n")
        })
        arrDoc.push("**********************\n")
        arrDoc.push("\n")
      })

       result = arrDoc.join(" ")


      pdf
        .font('./files/tmn.ttf')
        .fontSize(14)
        .text(result, 0, 0)

      pdf.end();

       doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun(result),
                ],
              }),
            ],
          },
        ],
      });
      await Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("./files/data.docx", buffer);
      });


    } catch (error){
      next(ApiError.badRequest(error))
    } finally {
      return res.json(projects1)
    }
  }

}

module.exports = new DocxController()
