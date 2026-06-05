const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getMatchedDonations = async (req, res) => {
  try {
    const { area, maxDistance, volunteerId } = req.query;
    
    let where = { status: 'available' };
    
    if (area) {
      where.area = { contains: area, mode: 'insensitive' };
    }
    
    if (volunteerId) {
      where.suggestedVolunteerId = volunteerId;
    }

    const donations = await prisma.donation.findMany({
      where,
      orderBy: [
        { suggestedVolunteerId: volunteerId ? 'desc' : 'asc' },
        { preferredPickupTime: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        photos: true,
        donor: { select: { name: true, phone: true } }
      }
    });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { getMatchedDonations };