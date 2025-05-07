// therapistController.js

// Get therapist profile
exports.getProfile = async (req, res) => {
    try {
      const therapist = await db.therapists.findOne({ 
        where: { user_id: req.user.user_id },
        include: [
          { 
            model: db.therapist_specializations, 
            as: 'specializations',
            attributes: ['specialization']
          },
          { 
            model: db.therapist_availability, 
            as: 'availability',
            attributes: ['day_of_week', 'start_time', 'end_time']
          }
        ]
      });
  
      if (!therapist) {
        return res.status(404).json({ message: 'Therapist profile not found' });
      }
  
      res.json({
        name: `${req.user.first_name} ${req.user.last_name}`,
        specialization: therapist.specialization,
        email: req.user.email,
        phone: therapist.phone,
        address: therapist.address,
        bio: therapist.bio,
        profile_picture_url: therapist.profile_picture_url,
        credentials: therapist.credentials,
        treatment_methods: therapist.treatment_methods,
        languages: therapist.languages,
        availability: therapist.availability.map(a => ({
          day: a.day_of_week,
          startTime: a.start_time,
          endTime: a.end_time
        })),
        specializations: therapist.specializations.map(s => s.specialization)
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
  };
  
  // Update therapist profile
  exports.updateProfile = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
      const { 
        phone, address, bio, profile_picture_url,
        credentials, treatment_methods, languages, availability, specializations
      } = req.body;
  
      // Update therapist table
      await db.therapists.update({
        phone,
        address,
        bio,
        profile_picture_url,
        credentials,
        treatment_methods,
        languages
      }, {
        where: { user_id: req.user.user_id },
        transaction
      });
  
      // Update specializations (many-to-many)
      await db.therapist_specializations.destroy({
        where: { therapist_id: req.user.therapist_id },
        transaction
      });
      
      if (specializations && specializations.length > 0) {
        await db.therapist_specializations.bulkCreate(
          specializations.map(spec => ({
            therapist_id: req.user.therapist_id,
            specialization: spec
          })),
          { transaction }
        );
      }
  
      // Update availability
      await db.therapist_availability.destroy({
        where: { therapist_id: req.user.therapist_id },
        transaction
      });
      
      if (availability && availability.length > 0) {
        await db.therapist_availability.bulkCreate(
          availability.map(avail => ({
            therapist_id: req.user.therapist_id,
            day_of_week: avail.day,
            start_time: avail.startTime,
            end_time: avail.endTime,
            is_recurring: true
          })),
          { transaction }
        );
      }
  
      await transaction.commit();
      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  };