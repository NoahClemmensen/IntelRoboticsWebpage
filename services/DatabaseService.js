const mysql = require('mysql2/promise');

let procedureConf = {
    socketPath: process.env.DB_SOCKET,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_PROCEDURE_USER,
    password: process.env.DB_PROCEDURE_PASSWORD,
    database: process.env.DB_NAME,
}

let selectConf = {
    socketPath: process.env.DB_SOCKET,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_SELECT_USER,
    password: process.env.DB_SELECT_PASSWORD,
    database: process.env.DB_NAME,
}

let procedureConn = mysql.createConnection(procedureConf);
let selectConn = mysql.createConnection(selectConf);

class Database {
    static async getRobots() {
        return this.query('SELECT * FROM robots where status != 3');
    }

    static async getRobotDetails() {
        return this.query('SELECT * FROM robot_details');
    }

    static async getLocations() {
        return this.query('SELECT * FROM locations');
    }

    static async createLocation(name) {
        return this.queryProcedure('create_location(?)', [name]);
    }

    static async createRobot(name, locationId) {
        return this.queryProcedure('create_robot(?, ?)', [name, locationId]);
    }

    static async logAction(status, serial, data) {
        return this.queryProcedure('log_action(?, ?, ?)', [status, serial, data]);
    }

    static async query(sql, args) {
        if (selectConn instanceof Promise) {
            selectConn = await selectConn;
        }

        const [results, fields] = await selectConn.query(sql, args);
        return results;
    }

    static async queryProcedure(sql, args) {
        if (procedureConn instanceof Promise) {
            procedureConn = await procedureConn;
        }

        const [results, fields] = await procedureConn.query('call ' + sql, args);
        return results;
    }
}

module.exports = Database;