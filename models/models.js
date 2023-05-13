const sequelize = require('../db')
const {DataTypes} = require("sequelize");

const User = sequelize.define('user',{
  id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: { type:DataTypes.STRING, unique: true},
  password: { type:DataTypes.STRING},
})

const UserProject = sequelize.define('user_project',{
  id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Project = sequelize.define('project',{
  id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  project_name: { type:DataTypes.STRING},
})

const Works = sequelize.define('works',{
  id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  work_name: { type:DataTypes.STRING},
  date_start: { type:DataTypes.STRING},
  date_end: { type:DataTypes.STRING},
  price: { type:DataTypes.DECIMAL},
})

const WorksStatus = sequelize.define('works_status',{
  id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  complited: { type:DataTypes.BOOLEAN},
  text: { type:DataTypes.STRING},
  percent_complited: { type:DataTypes.INTEGER, defaultValue: 0},
})

const WorksAttributes = sequelize.define('works_attributes',{
  id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  work_name: { type:DataTypes.STRING},
  date_start: { type:DataTypes.STRING},
  date_end: { type:DataTypes.STRING},
})

const WorksAttributesStatus = sequelize.define('works_attributes_status',{
  id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  complited: { type:DataTypes.BOOLEAN},
  text: { type:DataTypes.STRING},
})

User.belongsToMany(Project, {
  through: UserProject
})
Project.belongsToMany(User, {
  through: UserProject
})

Project.hasMany(Works)
Works.belongsTo(Project)

Works.hasOne(WorksStatus)
WorksStatus.belongsTo(Works)

Works.hasMany(WorksAttributes)
WorksAttributes.belongsTo(Works)

WorksAttributes.hasOne(WorksAttributesStatus)
WorksAttributesStatus.belongsTo(WorksAttributes)

module.exports = {
  User,
  Project,
  Works,
  WorksStatus,
  WorksAttributes,
  WorksAttributesStatus,
  UserProject
}
