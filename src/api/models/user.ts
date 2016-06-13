'use strict';

import * as S from 'sequelize';

const User = (sequelize: S.Sequelize) => {
  return sequelize.define('user', {
    email: {
      type: S.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      }
    },
    password: S.STRING,
    firstName: S.STRING,
    middleName: S.STRING,
    lastName: S.STRING,
  });
};

export {
  User
};

