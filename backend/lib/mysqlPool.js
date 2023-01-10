//连接池
const mysql = require("mysql");
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DATABASE, MYSQL_PORT } = process.env
const pool = mysql.createPool({ host: MYSQL_HOST, user: MYSQL_USER, password: MYSQL_PASS, database: MYSQL_DATABASE, port: MYSQL_PORT });

const query = function (sql) {
    return new Promise((resolve, reject) => {
        try {
            pool.getConnection((err1, connection) => {
                err1 ? reject(err1) : connection.query(sql, (err2, results) => {
                    connection.release();
                    err2 ? reject(err2) : resolve(results);
                });
            })
        } catch (error) { reject(error); }
    })
}


module.exports = query;
