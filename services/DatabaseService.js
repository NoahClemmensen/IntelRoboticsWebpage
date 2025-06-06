﻿const mysql = require('mysql2/promise');

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
        return this.query('SELECT * FROM robot_details where status_id != 3');
    }

    static async getTotalStatistics() {
        return this.query('SELECT * FROM total_statistics');
    }

    static async getLocations() {
        return this.query('SELECT * FROM locations');
    }

    static async createLocation(name) {
        return this.queryProcedure('create_location(?)', [name]);
    }

    static async createRobot(serial, locationId) {
        try {
            return this.queryProcedure('create_robot(?, ?)', [serial, locationId]);
        } catch (e) {
            console.error('Error creating robot:', e);
            throw new Error('Failed to create robot');
        }
    }

    static async logAction(status, serial, data) {
        return this.queryProcedure('log_action(?, ?, ?)', [status, serial, data]);
    }

    static async getUserByUsername(username) {
        return this.query('SELECT * FROM users WHERE username = ?', [username]);
    }

    static async createUser(username, password, role_id, location_id) {
        try {
            console.log(username, password, role_id, location_id);
            return this.queryProcedure('create_user(?, ?, ?, ?)', [username, password, role_id, location_id]);
        } catch (e) {
            console.error('Error creating user:', e);
            throw new Error('Failed to create user');
        }
    }

    static async deleteUser(id) {
        try {
            return this.queryProcedure('delete_user(?)', [id]);
        } catch (e) {
            console.error('Error deleting user:', e);
            throw new Error('Failed to delete user');
        }
    }

    static async getUserDetails() {
        return this.query('SELECT * FROM user_details WHERE deleted != 1');
    }

    static async getRobotDetailsById(id) {
        const result = await this.query('SELECT * FROM robot_details WHERE robot_id = ?', [id]);
        try {
            return result[0];
        } catch (error) {
            console.error('Error fetching robot details by ID:', error);
            return null;
        }
    }

    static async getRobotDetailsBySerial(serial) {
        return this.query('SELECT * FROM robot_details WHERE serial_number = ?', [serial]);
    }

    static async getStatuses() {
        return this.query('SELECT * FROM statuses');
    }

    static async updateRobot(id, serial_number, status, location) {
        return this.queryProcedure('update_robot(?, ?, ?, ?)', [id, status, location, serial_number]);
    }

    static async getUserRoleId(username) {
        const result = await this.query('SELECT role_id FROM users WHERE username = ?', [username]);
        if (result) {
            return result[0].role_id;
        }
        return null;
    }

    static async deleteRobot(id) {
        return this.queryProcedure('delete_robot(?)', [id]);
    }

    static async getUsers() {
        return this.query('SELECT * FROM users');
    }

    static async getRoles() {
        return this.query('SELECT * FROM roles');
    }

    static async getUserDetailsById(id) {
        return await this.query('SELECT * FROM user_details WHERE id = ?', [id]);
    }

    static async getUserDetailsByUsername(username) {
        return await this.query('SELECT * FROM users WHERE username = ?', [username]);
    }

    static async updateUser(id, username, password, role_id, location_id) {
        return this.queryProcedure('update_user(?, ?, ?, ?, ?)', [id, username, password, role_id, location_id]);
    }

    static async getFailedRobots() {
        return this.query('SELECT * FROM robot_details WHERE status_id = 4');
    }

    static async updateRobotStatus(id, status) {
        return this.queryProcedure('update_status(?, ?)', [id, status]);
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