import * as Sequelize from 'sequelize';

const User = {
  id: {
    type: Sequelize.INTEGER,
  },
  email: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  firstName: {
    type: Sequelize.STRING,
  },
  middleName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  createdTime: {
    type: Sequelize.TIME,
  },
  updatedTime: {
    type: Sequelize.TIME,
  },
};
