const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getDonorProfile = async (req, res) => {
  try {
    const donor = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phone: true, createdAt: true }
    });

    const donationStats = await prisma.donation.aggregate({
      where: { donorId: req.user.id },
      _count: { _all: true },
      _sum: { approxQuantity: true }
    });

    const completedDonations = await prisma.donation.count({
      where: { donorId: req.user.id, status: 'completed' }
    });

    res.json({
      ...donor,
      totalDonations: donationStats._count._all,
      totalMealsShared: donationStats._sum.approxQuantity || 0,
      completedDonations
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createRating = async (req, res) => {
  try {
    const { donationId, rating, comment } = req.body;
    
    const donation = await prisma.donation.findFirst({
      where: { 
        id: donationId, 
        donorId: req.user.id, 
        status: 'completed' 
      },
      include: {
        acceptances: true
      }
    });

    if (!donation || donation.acceptances.length === 0) {
      return res.status(400).json({ error: 'Invalid donation or volunteer' });
    }

    const volunteerId = donation.acceptances[0].volunteerId;

    const newRating = await prisma.rating.create({
      data: { donationId, donorId: req.user.id, volunteerId, rating, comment }
    });

    res.json(newRating);
  } catch (error) {
    console.error("Detalle del error en BD:", error); 
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ya calificaste esta donación antes.' });
    }
    res.status(500).json({ error: 'Error del servidor al guardar calificación' });
  }
};

module.exports = { getDonorProfile, createRating };