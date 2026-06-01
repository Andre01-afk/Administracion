require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createUsers() {
    try {
        // Eliminar usuarios de prueba existentes
        await prisma.user.deleteMany({
            where: {
                email: {
                    in: ['donor@example.com', 'volunteer@example.com', 'test@example.com']
                }
            }
        });
        console.log('✓ Usuarios anteriores eliminados');

        // Crear donor
        const donorPassword = await bcrypt.hash('donor123', 10);
        const donor = await prisma.user.create({
            data: {
                name: 'Donante Test',
                email: 'donor@example.com',
                phone: '+34 600 111 111',
                password: donorPassword,
                role: 'donor'
            }
        });
        console.log('✓ Usuario DONOR creado:');
        console.log(`  Email: donor@example.com`);
        console.log(`  Password: donor123`);

        // Crear volunteer
        const volunteerPassword = await bcrypt.hash('volunteer123', 10);
        const volunteer = await prisma.user.create({
            data: {
                name: 'Voluntario Test',
                email: 'volunteer@example.com',
                phone: '+34 600 222 222',
                password: volunteerPassword,
                role: 'volunteer'
            }
        });
        console.log('\n✓ Usuario VOLUNTEER creado:');
        console.log(`  Email: volunteer@example.com`);
        console.log(`  Password: volunteer123`);

        await prisma.$disconnect();
    } catch (error) {
        console.error('Error:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

createUsers();
