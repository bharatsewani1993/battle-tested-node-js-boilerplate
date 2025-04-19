const sequelize = require('../config/mysql');
const Permission = require('../models/permissionModel');
const defaultPermissions = require('../objects/permission.objects');
const { success, failure } = require('../objects/return.objects');
const { catchBlockErrorHandler } = require('../utils/errorHandler');

const seedDefaultPermissions = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB ✅');

        for (const perm of defaultPermissions) {
            const [record, created] = await Permission.findOrCreate({
                where: { key: perm.key },
                defaults: {
                    ...perm,
                    isDefault: 1,
                    createdBy: 0, // system
                    active: 1
                }
            });

            //console.log(`${created ? 'Inserted' : 'Skipped'}: ${perm.key}`);
        }

        console.log('🎉 Default permissions seeding complete!');

        const successObj = success();
        successObj.message = "Default permissions seeded successfully";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Failed to seed default permissions";
        return failureObj;
    }
};

module.exports = seedDefaultPermissions;