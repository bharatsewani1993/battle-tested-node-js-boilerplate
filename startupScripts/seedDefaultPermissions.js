const sequelize = require('../config/mysql');
const Permission = require('../models/permissionModel');
const defaultPermissions = require('../objects/permission.objects');


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

            console.log(`${created ? 'Inserted' : 'Skipped'}: ${perm.key}`);
        }

        console.log('🎉 Default permissions seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to seed permissions:', err);
        process.exit(1);
    }
};

module.exports = seedDefaultPermissions;