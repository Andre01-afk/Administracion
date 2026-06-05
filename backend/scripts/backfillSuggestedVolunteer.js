// backend/scripts/backfillSuggestedVolunteer.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const autoSuggestVolunteer = async (donationId, area) => {
  try {
    const busyIds = await prisma.acceptance.findMany({
      where: { status: 'accepted' },
      select: { volunteerId: true }
    }).then(acc => acc.map(a => a.volunteerId));

    const volunteers = await prisma.user.findMany({
      where: { role: 'volunteer', id: { notIn: busyIds } },
      include: {
        acceptances: {
          where: { status: 'completed' },
          include: { donation: { select: { area: true } } }
        },
        ratingsReceived: { select: { rating: true } }
      }
    });

    if (volunteers.length === 0) {
      console.log(`Sin voluntarios disponibles para donación ${donationId}`);
      return;
    }

    const scored = volunteers.map(v => {
      const avgRating = v.ratingsReceived.length > 0
        ? v.ratingsReceived.reduce((sum, r) => sum + r.rating, 0) / v.ratingsReceived.length
        : 0;
      const areaBonus = v.acceptances.some(
        a => a.donation?.area?.toLowerCase().includes(area.toLowerCase())
      ) ? 2 : 0;
      const experienceBonus = Math.min(v.acceptances.length * 0.1, 1);
      return { id: v.id, score: avgRating + areaBonus + experienceBonus };
    });

    const best = scored.sort((a, b) => b.score - a.score)[0];

    await prisma.donation.update({
      where: { id: donationId },
      data: { suggestedVolunteerId: best.id }
    });

    console.log(`✅ Donación ${donationId} → Voluntario ${best.id} (score: ${best.score.toFixed(2)})`);
  } catch (err) {
    console.error(`❌ Error en donación ${donationId}:`, err.message);
  }
};

const run = async () => {
  try {
    const donations = await prisma.donation.findMany({
      where: { 
        status: 'available',
        suggestedVolunteerId: null 
      }
    });

    console.log(`Donaciones a procesar: ${donations.length}`);

    if (donations.length === 0) {
      console.log('No hay donaciones sin voluntario sugerido.');
      return;
    }

    for (const donation of donations) {
      await autoSuggestVolunteer(donation.id, donation.area);
    }

    console.log('\n✅ Proceso completado!');
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    await prisma.$disconnect();
  }
};

run();