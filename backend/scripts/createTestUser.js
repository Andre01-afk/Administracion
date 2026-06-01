require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestUser() {
    try {
        // Check if test user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: 'test@example.com' }
        });

        if (existingUser) {
            console.log('✓ Test user already exists');
            console.log(`Email: ${existingUser.email}`);
            console.log(`Password: test123`);
            await prisma.$disconnect();
            return;
        }

        // Create test user
        const hashedPassword = await bcrypt.hash('test123', 10);
        const user = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                phone: '+34 600 000 000',
                password: hashedPassword,
                role: 'user'
            }
        });

        console.log('✓ Test user created successfully!');
        console.log(`Email: ${user.email}`);
        console.log(`Password: test123`);
        
        await prisma.$disconnect();
    } catch (error) {
        console.error('Error creating test user:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

createTestUser();
