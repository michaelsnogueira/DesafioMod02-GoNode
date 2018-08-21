module.exports = (sequelize, DataType) => {
  const Project = sequelize.define('Project', {
    title: DataType.STRING,
  });
  Project.associate = (models) => {
    Project.belongsTo(models.User);
    Project.hasMany(models.SessionProject);
  };

  return Project;
};
