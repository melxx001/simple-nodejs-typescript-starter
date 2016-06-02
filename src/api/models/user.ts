'use strict';

import * as S from 'sequelize';

const User = (sequelize: S.Sequelize) => {
  return sequelize.define('user', {
    email: S.STRING,
    password: S.STRING,
    firstName: S.STRING,
    middleName: S.STRING,
    lastName: S.STRING,
    // createdTime: S.TIME,
    // updatedTime: S.TIME,
  });
};

export {
  User
};

