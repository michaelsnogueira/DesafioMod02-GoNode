module.exports = (Sequelize, DataTypes) => {
  const Session = Sequelize.define('Session', {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
  });
  return Session;
};
