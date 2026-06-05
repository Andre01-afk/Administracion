const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createDonation = async (req, res) => {
  try {
    const { foodType, approxQuantity, quantityUnit, area, pickupAddress, preferredPickupTime, contactNumber, photos, suggestedVolunteerId } = req.body;
    
    // Validar campos requeridos
    if (!foodType || !approxQuantity || !area || !pickupAddress) {
      return res.status(400).json({ error: 'Missing required fields: foodType, approxQuantity, area, pickupAddress' });
    }

    // Preparar datos de fotos
    let photosData = undefined;
    if (photos && Array.isArray(photos) && photos.length > 0) {
      photosData = {
        create: photos.map(photo => ({
          url: typeof photo === 'string' ? photo : photo.url
        }))
      };
    }

    const donation = await prisma.donation.create({
      data: {
        donorId: req.user.id,
        foodType,
        approxQuantity: parseInt(approxQuantity),
        quantityUnit: quantityUnit || 'portions',
        area,
        pickupAddress,
        preferredPickupTime: preferredPickupTime ? new Date(preferredPickupTime) : null,
        contactNumber: contactNumber || null,
        suggestedVolunteerId: suggestedVolunteerId || null,
        ...(photosData && { photos: photosData })
      },
      include: { photos: true }
    });
    if(!suggestedVolunteerId){
      await autoSuggestVolunteer(donation.id, donation.area);
    }

    res.json(donation);
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};


const autoSuggestVolunteer = async (donationId, area) =>{
  try{
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

    if (volunteers.length === 0) return;

    const scored = volunteers.map(v => {
      const avgRating = v.ratingsReceived.length > 0
        ? v.ratingsReceived.reduce((sum, r) => sum + r.rating, 0) / v.ratingsReceived.length
        : 0;
      const areaBonus = v.acceptances.some(
        a => a.donation?.area?.toLowerCase().includes(area.toLowerCase())
      ) ? 2 : 0;
      const experienceBonus = Math.min(v.acceptances.length * 0.1, 1);
      return { id: v.id,
        score: avgRating + areaBonus + experienceBonus ,
        totalRatings: v.ratingsReceived.length,
        completedTasks: v.acceptances.length,
        createdAt: v.createdAt,
      };
    });

    const best = scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if(b.totalRatings !== a.totalRatings) return b.totalRatings - a.totalRatings;
      if(b.completedTasks !== a.completedTasks) return b.completedTasks - a.completedTasks;
      return new Date(a.createdAt) - new Date(b.createdAt);
    })[0];

    await prisma.donation.update({
      where: { id: donationId },
      data: { suggestedVolunteerId: best.id }

    });
  }catch(err){
    console.error('AutoSuggest Error',err)
  }
};

const getDonations = async (req, res) => {
  try {
    const { area, status, sort = 'createdAt', page = 1, limit = 10, donorId, myTasks } = req.query;
    
    const where = {};
    // Si myTasks=true, obtener solo las donaciones aceptadas por el voluntario actual
    if (myTasks === 'true') {
      // Encontrar todas las aceptaciones del voluntario actual
      const acceptances = await prisma.acceptance.findMany({
        where: { volunteerId: req.user.id }
      });
      
      if (acceptances.length === 0) {
        return res.json([]);
      }
      
      const donationIds = acceptances.map(a => a.donationId);
      where.id = { in: donationIds };
      where.status = 'accepted';
    }
    else if (donorId) {
      where.donorId = donorId;
    } 
    else {
      where.status = status || 'available';
    }
    
    if (area) where.area = { contains: area, mode: 'insensitive' };

    const orderBy = sort === 'pickup_time' ? { preferredPickupTime: 'asc' } : 
                   sort === 'area' ? { area: 'asc' } : { createdAt: 'desc' };
               
    const donations = await prisma.donation.findMany({
      where,
      orderBy,
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      include: { photos: true, donor: { select: { name: true, phone: true } },ratings: true }
    });

    res.json(donations); 
  } catch (error) {
    console.error('Error getting donations:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

const acceptDonation = async (req, res) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.donation.updateMany({
        where: { id: req.params.id, status: 'available' },
        data: { status: 'accepted', acceptedAt: new Date() }
      });

      if (updated.count === 0) {
        throw new Error('Donation not available');
      }

      return await tx.acceptance.create({
        data: {
          donationId: req.params.id,
          volunteerId: req.user.id
        }
      });
    });

    res.json({ message: 'Donation accepted', acceptance: result });
  } catch (error) {
    if (error.message === 'Donation not available') {
      return res.status(409).json({ error: 'Donation not available' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

const cancelDonation = async (req,res) =>{
  try {
    const donation = await prisma.donation.findFirst({
      where: { 
        id: req.params.id, 
        donorId: req.user.id 
      }
    });

    if (!donation) {
      return res.status(404).json({ error: 'Donación no encontrada o no tienes permiso para cancelarla' });
    }

    if (donation.status === 'completed') {
      return res.status(400).json({ error: 'No puedes cancelar una donación que ya fue entregada' });
    }

    const cancelledDonation = await prisma.donation.update({
      where: { id: req.params.id },
      data: { status: 'cancelled' }
    });

    res.json({ message: 'Donación cancelada exitosamente', donation: cancelledDonation });
  } catch (error) {
    console.error('Error canceling donation:', error);
    res.status(500).json({ error: 'Error del servidor al cancelar la donación' });
  }
};



const completeDonation = async (req, res) => {
  try {
    const acceptance = await prisma.acceptance.findFirst({
      where: { donationId: req.params.id, volunteerId: req.user.id }
    });

    if (!acceptance) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.$transaction([
      prisma.donation.update({
        where: { id: req.params.id },
        data: { status: 'completed', completedAt: new Date() }
      }),
      prisma.acceptance.update({
        where: { id: acceptance.id },
        data: { status: 'completed', completedAt: new Date() }
      })
    ]);

    res.json({ message: 'Donation completed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createDonation, getDonations, acceptDonation, completeDonation, cancelDonation };