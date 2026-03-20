require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Country = require('../models/Country');
const Admin1 = require('../models/Admin1');
const Admin2 = require('../models/Admin2');
const Place = require('../models/Place');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedCountries = async () => {
  try {
    console.log('Seeding countries...');
    const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,cca2,cca3');
    const countries = response.data.map(country => ({
      name: country.name.common,
      iso2: country.cca2,
      iso3: country.cca3
    }));
    
    await Country.deleteMany({});
    await Country.insertMany(countries);
    console.log(`Seeded ${countries.length} countries`);
  } catch (error) {
    console.error('Error seeding countries:', error);
  }
};

// Enhanced admin1 data with more countries
const enhancedAdmin1Data = {
  'KE': ['Nairobi County', 'Mombasa County', 'Kisumu County', 'Nakuru County', 'Uasin Gishu County', 'Kiambu County', 'Machakos County'],
  'US': ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'],
  'GB': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'NG': ['Lagos State', 'Abuja FCT', 'Kano State', 'Rivers State', 'Oyo State', 'Kaduna State', 'Ogun State', 'Imo State'],
  'ZA': ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Limpopo', 'Mpumalanga', 'North West', 'Free State'],
  'CA': ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan'],
  'AU': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania'],
  'IN': ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'],
  'BR': ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná', 'Rio Grande do Sul'],
  'DE': ['Bavaria', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Lower Saxony', 'Hesse', 'Saxony'],
  'FR': ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie', 'Hauts-de-France', 'Grand Est'],
  'IT': ['Lombardy', 'Lazio', 'Campania', 'Sicily', 'Veneto', 'Emilia-Romagna', 'Piedmont', 'Tuscany'],
  'ES': ['Andalusia', 'Catalonia', 'Madrid', 'Valencia', 'Galicia', 'Castile and León', 'Basque Country'],
  'MX': ['Mexico City', 'State of Mexico', 'Jalisco', 'Nuevo León', 'Puebla', 'Guanajuato', 'Veracruz'],
  'JP': ['Tokyo', 'Osaka', 'Kanagawa', 'Aichi', 'Saitama', 'Chiba', 'Hyōgo', 'Hokkaido', 'Fukuoka'],
  'CN': ['Beijing', 'Shanghai', 'Guangdong', 'Shandong', 'Jiangsu', 'Zhejiang', 'Henan', 'Sichuan']
};

const seedAdmin1 = async () => {
  try {
    console.log('Seeding admin1...');
    const countries = await Country.find({});
    
    await Admin1.deleteMany({});
    
    for (const country of countries) {
      const admin1Names = enhancedAdmin1Data[country.iso2] || [];
      if (admin1Names.length > 0) {
        const admin1Docs = admin1Names.map(name => ({
          countryId: country._id,
          name: name
        }));
        await Admin1.insertMany(admin1Docs);
      }
    }
    console.log('Seeded admin1 data');
  } catch (error) {
    console.error('Error seeding admin1:', error);
  }
};

// Enhanced places data with major cities worldwide
const enhancedPlacesData = {
  'KE': [
    { name: 'Nairobi', lat: -1.2921, lon: 36.8219, population: 4397073 },
    { name: 'Mombasa', lat: -4.0435, lon: 39.6682, population: 1208333 },
    { name: 'Kisumu', lat: -0.1022, lon: 34.7617, population: 409928 },
    { name: 'Nakuru', lat: -0.3031, lon: 36.0800, population: 307990 },
    { name: 'Eldoret', lat: 0.5143, lon: 35.2698, population: 289380 },
    { name: 'Thika', lat: -1.0332, lon: 37.0692, population: 136576 }
  ],
  'US': [
    { name: 'New York', lat: 40.7128, lon: -74.0060, population: 8336817 },
    { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, population: 3979576 },
    { name: 'Chicago', lat: 41.8781, lon: -87.6298, population: 2693976 },
    { name: 'Houston', lat: 29.7604, lon: -95.3698, population: 2320268 },
    { name: 'Phoenix', lat: 33.4484, lon: -112.0740, population: 1680992 },
    { name: 'Philadelphia', lat: 39.9526, lon: -75.1652, population: 1584064 },
    { name: 'San Antonio', lat: 29.4241, lon: -98.4936, population: 1547253 },
    { name: 'San Diego', lat: 32.7157, lon: -117.1611, population: 1423851 }
  ],
  'GB': [
    { name: 'London', lat: 51.5074, lon: -0.1278, population: 9648110 },
    { name: 'Birmingham', lat: 52.4862, lon: -1.8904, population: 1141816 },
    { name: 'Manchester', lat: 53.4808, lon: -2.2426, population: 547899 },
    { name: 'Glasgow', lat: 55.8642, lon: -4.2518, population: 635640 },
    { name: 'Liverpool', lat: 53.4084, lon: -2.9916, population: 498042 }
  ],
  'NG': [
    { name: 'Lagos', lat: 6.5244, lon: 3.3792, population: 15388000 },
    { name: 'Kano', lat: 12.0022, lon: 8.5920, population: 4103000 },
    { name: 'Ibadan', lat: 7.3775, lon: 3.9470, population: 3649000 },
    { name: 'Abuja', lat: 9.0765, lon: 7.3986, population: 3464000 },
    { name: 'Port Harcourt', lat: 4.8156, lon: 7.0498, population: 1865000 }
  ],
  'IN': [
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777, population: 20411274 },
    { name: 'Delhi', lat: 28.7041, lon: 77.1025, population: 16787941 },
    { name: 'Bangalore', lat: 12.9716, lon: 77.5946, population: 8443675 },
    { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, population: 6809970 },
    { name: 'Chennai', lat: 13.0827, lon: 80.2707, population: 4681087 }
  ],
  'CN': [
    { name: 'Shanghai', lat: 31.2304, lon: 121.4737, population: 24256800 },
    { name: 'Beijing', lat: 39.9042, lon: 116.4074, population: 21542000 },
    { name: 'Guangzhou', lat: 23.1291, lon: 113.2644, population: 13501100 },
    { name: 'Shenzhen', lat: 22.5431, lon: 114.0579, population: 12528300 }
  ],
  'BR': [
    { name: 'São Paulo', lat: -23.5558, lon: -46.6396, population: 12325232 },
    { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, population: 6748000 },
    { name: 'Brasília', lat: -15.8267, lon: -47.9218, population: 3055149 }
  ],
  'JP': [
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503, population: 37435191 },
    { name: 'Osaka', lat: 34.6937, lon: 135.5023, population: 2691185 },
    { name: 'Yokohama', lat: 35.4437, lon: 139.6380, population: 3726167 }
  ]
};

const seedPlaces = async () => {
  try {
    console.log('Seeding places...');
    const countries = await Country.find({});
    
    await Place.deleteMany({});
    
    for (const country of countries) {
      const places = enhancedPlacesData[country.iso2] || [];
      if (places.length > 0) {
        const placeDocs = places.map(place => ({
          countryId: country._id,
          name: place.name,
          lat: place.lat,
          lon: place.lon,
          population: place.population
        }));
        await Place.insertMany(placeDocs);
      }
    }
    console.log('Seeded places data');
  } catch (error) {
    console.error('Error seeding places:', error);
  }
};

const seedAll = async () => {
  await connectDB();
  await seedCountries();
  await seedAdmin1();
  await seedPlaces();
  console.log('Location seeding completed!');
  process.exit(0);
};

seedAll();