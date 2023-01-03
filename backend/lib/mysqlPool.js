//连接池
const mysql = require("mysql");
const pool = mysql.createPool({ host: 'localhost', user: 'root', password: 'root', database: 'librarian', port: 3306 });

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
