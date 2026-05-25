// Seed script to create an admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function seedAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        const existing = await usersCollection.findOne({ email: 'muvindu5910dilshan@gmail.com' });

        if (existing) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('21CIS0045**', salt);

            await usersCollection.updateOne(
                { email: 'muvindu5910dilshan@gmail.com' },
                {
                    $set: {
                        role: 'admin',
                        isApproved: true,
                        isActive: true,
                        isEmailVerified: true,
                        authProvider: 'local',
                        password: hashedPassword,
                    }
                }
            );
            console.log('Existing user updated to admin role with password!');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('21CIS0045**', salt);

            await usersCollection.insertOne({
                name: 'Admin',
                email: 'muvindu5910dilshan@gmail.com',
                password: hashedPassword,
                role: 'admin',
                authProvider: 'local',
                isEmailVerified: true,
                isApproved: true,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log('Admin user created successfully!');
        }

        console.log('Email: muvindu5910dilshan@gmail.com');
        console.log('Role: admin');

        await mongoose.disconnect();
        console.log('Done!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

seedAdmin();
