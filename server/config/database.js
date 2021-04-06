const Sequelize = require('sequelize');
module.exports = new Sequelize('enginela_enginelab', 'enginela_engine', 'zNwxhYXZk087', {
    host: 'engine-lab.mx',
    dialect: 'mysql',
    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
