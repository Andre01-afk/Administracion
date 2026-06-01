/**
 * Script simple para limpiar donaciones con base64
 * Ejecutar: node scripts/cleanOldImages.js --force
 */

const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function cleanup() {
  try {
    console.log('\n========================================');
    console.log('LIMPIEZA DE IMÁGENES BASE64');
    console.log('========================================\n');

    // Buscar donaciones con base64
    const donations = await prisma.donation.findMany({
      include: { photos: true }
    });

    let donationsWithBase64 = [];
    let totalBase64Photos = 0;

    for (const donation of donations) {
      if (donation.photos && donation.photos.length > 0) {
        const hasBase64 = donation.photos.some(p => p.url.startsWith('data:'));
        if (hasBase64) {
          donationsWithBase64.push(donation);
          totalBase64Photos += donation.photos.filter(p => p.url.startsWith('data:')).length;
        }
      }
    }

    console.log(`Total de donaciones: ${donations.length}`);
    console.log(`Donaciones con base64: ${donationsWithBase64.length}`);
    console.log(`Fotos en base64: ${totalBase64Photos}\n`);

    if (donationsWithBase64.length === 0) {
      console.log('✓ No hay imágenes base64 para limpiar\n');
      rl.close();
      await prisma.$disconnect();
      process.exit(0);
    }

    // Mostrar donaciones a eliminar
    console.log('Donaciones a eliminar:');
    donationsWithBase64.forEach((d, i) => {
      const base64Count = d.photos.filter(p => p.url.startsWith('data:')).length;
      console.log(`  ${i + 1}. ${d.foodType} (${base64Count} fotos base64)`);
    });
    console.log('');

    // Solicitar confirmación
    const forceFlag = process.argv.includes('--force');
    
    if (forceFlag) {
      console.log('Modo --force detectado. Eliminando sin confirmación...\n');
    } else {
      const confirm = await askQuestion('¿Deseas eliminar estas donaciones? (s/n): ');
      if (confirm.toLowerCase() !== 's') {
        console.log('\nOperación cancelada.\n');
        rl.close();
        await prisma.$disconnect();
        process.exit(0);
      }
    }

    // Eliminar
    console.log('Eliminando...\n');
    let deleted = 0;

    for (const donation of donationsWithBase64) {
      // Eliminar aceptaciones
      await prisma.acceptance.deleteMany({
        where: { donationId: donation.id }
      });

      // Eliminar ratings
      await prisma.rating.deleteMany({
        where: { donationId: donation.id }
      });

      // Eliminar fotos
      await prisma.donationPhoto.deleteMany({
        where: { donationId: donation.id }
      });

      // Eliminar donación
      await prisma.donation.delete({
        where: { id: donation.id }
      });

      deleted++;
      console.log(`✓ Eliminada: ${donation.foodType}`);
    }

    console.log(`\n✓ Limpieza completada: ${deleted} donaciones eliminadas\n`);
    rl.close();
    await prisma.$disconnect();
  } catch (error) {
    console.error('\n✗ Error durante la limpieza:', error.message);
    console.log('\nDetalles:', error);
    rl.close();
    await prisma.$disconnect();
    process.exit(1);
  }
}

cleanup();
