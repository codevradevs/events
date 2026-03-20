const express = require('express');
const Country = require('../models/Country');
const Admin1 = require('../models/Admin1');
const Place = require('../models/Place');
const Admin2 = require('../models/Admin2');

const router = express.Router();

// Get all countries
router.get('/countries', async (req, res) => {
  try {
    const countries = await Country.find({}, { name: 1, iso2: 1 }).sort({ name: 1 });
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get admin1 (states/provinces) for a country
router.get('/countries/:countryId/admin1', async (req, res) => {
  try {
    const admin1 = await Admin1.find({ countryId: req.params.countryId }).sort({ name: 1 });
    res.json(admin1);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get admin2 (counties/districts) for an admin1
router.get('/admin1/:admin1Id/admin2', async (req, res) => {
  try {
    const admin2 = await Admin2.find({ admin1Id: req.params.admin1Id }).sort({ name: 1 });
    res.json(admin2);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search places in a country/admin1/admin2
router.get('/places', async (req, res) => {
  try {
    const { countryId, admin1Id, admin2Id, query, limit = 50 } = req.query;
    
    const filter = { countryId };
    if (admin1Id) filter.admin1Id = admin1Id;
    if (admin2Id) filter.admin2Id = admin2Id;
    if (query) filter.name = { $regex: query, $options: 'i' };
    
    const places = await Place.find(filter)
      .limit(Number(limit))
      .sort({ population: -1, name: 1 });
    
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;