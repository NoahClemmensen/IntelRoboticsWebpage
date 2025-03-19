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
    // static async getDevices() {
    //     return this.query('SELECT * FROM devices where deleted = 0');
    // }
    //
    // static async getRelevantAlarms() {
    //     return this.query('select * from alarm where timestamp >= date_sub(now(), interval 1 day);');
    // }
    //
    // static async getReceivers() {
    //     return this.query('SELECT * FROM alarm_receiver where active = 1');
    // }
    //
    // static async createReceiver(email, phone) {
    //     return this.queryProcedure('create_alarm_receiver(?,?)', [email, phone]);
    // }
    //
    // static async deleteReceiver(id) {
    //     return this.queryProcedure('delete_alarm_receiver(?)', [id]);
    // }
    //
    // static async getDeviceBySerial(sn) {
    //     return this.query('SELECT * FROM devices WHERE serial = ?', [sn]);
    // }
    //
    // static async checkSerial(sn) {
    //     const result = await this.query('SELECT * FROM devices WHERE serial = ?', [sn]);
    //     return result.length > 0;
    // }
    //
    // static async checkReceiver(id) {
    //     const result = await this.query('SELECT * FROM alarm_receiver WHERE id = ? and active = 1', [id]);
    //     return result.length > 0;
    // }
    //
    // static async getSettings() {
    //     const result = await this.queryProcedure('get_settings()');
    //     return result[0][0];
    // }
    //
    // static async saveSettings(settings) {
    //     return this.queryProcedure('change_settings(?,?,?,?,?,?,?,?,?,?,?)', [settings.max_temp, settings.min_temp, settings.max_fugt, settings.min_fugt, settings.temp_interval, settings.fugt_interval, settings.start_time, settings.end_time, settings.password, settings.max_sound, settings.fahrenheit]);
    // }
    //
    // static async logTemp(temperature, time, deviceSN) {
    //     return this.queryProcedure('log_temp(?,?,?)', [temperature, new Date(time), deviceSN]);
    // }
    //
    // static async logSound(sound, time, deviceSN) {
    //     return this.queryProcedure('log_sound(?,?,?)', [sound, new Date(time), deviceSN]);
    // }
    //
    // static async logHumidity(humidity, time, deviceSN) {
    //     return this.queryProcedure('log_humidity(?,?,?)', [humidity, new Date(time), deviceSN]);
    // }
    //
    // static async getClimateData(deviceSN) {
    //     return this.queryProcedure('get_climate_info(?)', [deviceSN]);
    // }
    //
    // static async editDevice(sn, location, name, desc) {
    //     return this.queryProcedure('edit_device(?,?,?,?)', [sn, location, name, desc]);
    // }
    //
    // static async deleteDevice(sn) {
    //     return this.queryProcedure('delete_device(?)', [sn]);
    // }
    //
    // static async createDevice(sn, location, name, desc) {
    //     return this.queryProcedure('create_device(?,?,?,?)', [sn, location, name, desc]);
    // }

    static async getPassword() {
        const result = await this.query('select password from settings order by id desc limit 1');
        return result[0].password;
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