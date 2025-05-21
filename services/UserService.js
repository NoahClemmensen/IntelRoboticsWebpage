const DatabaseService = require('./DatabaseService');

const UserRoles = Object.freeze({
    ADMIN: 1,
    STAFF: 2,
    USER: 3
});

class UserService {
    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    async isUserAdmin(username) {
        const roleId = await DatabaseService.getUserRoleId(username);
        if (roleId) {
            return roleId === UserRoles.ADMIN;
        }
        return false;
    }

    async isUserStaff(username) {
        const roleId = await DatabaseService.getUserRoleId(username);
        if (roleId) {
            return roleId === UserRoles.STAFF;
        }
        return false;
    }

    getUsernameFromJWT(token) {
        const payload = token.split('.')[1];
        const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');
        const jsonPayload = JSON.parse(decodedPayload);
        return jsonPayload.username;
    }
}

module.exports = UserService;