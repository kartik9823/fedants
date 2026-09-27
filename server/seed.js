require('dotenv').config();
const mongoose = require('mongoose');
const Competition = require('./models/Competition');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feedants';

const sampleCompetition = {
  title: 'Feedants Classical Dance',
  description: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
  category: 'Dance',
  type: 'Multi-Win',
  entryFee: 99,
  prizePool: 1500,
  maxParticipants: 20,
  currentParticipants: 1,
  registrationStart: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  registrationEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days ahead
  competitionStart: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  competitionEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  resultDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
  status: 'REGISTRATION_OPEN',
  winnersGetCertificate: true,
  judge: {
    name: 'Manju Dubey',
    title: 'Professional Kathak Dancer',
    experience: '12+ Years of Experience',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  },
  rewards: [
    { position: 1, label: '1st Winner', amount: 550, icon: '🏆' },
    { position: 2, label: '2nd Winner', amount: 300, icon: '🥈' },
    { position: 3, label: '3rd Winner', amount: 240, icon: '🥉' },
    { position: 4, label: '4th Winner', amount: 200, icon: '🎗️' },
    { position: 5, label: '5th Winner', amount: 130, icon: '🎗️' },
    { position: 6, label: '6th Winner', amount: 80, icon: '🎗️' },
  ],
  refundPolicy: 'Full refund within 24 hours of registration.',
  rulesAndEligibility: 'Performers of all age groups are eligible. Video submission length must be 2-5 minutes. Sound quality must be clear.',
  judgeParameters: 'Choreography (30%), Technique & Expression (40%), Rhythm & Timing (30%).',
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
  } catch (err) {
    console.log('Local MongoDB not available for seeding. Starting MongoDB Memory Server...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  }

  await Competition.deleteMany({});
  const comp = await Competition.create(sampleCompetition);
  console.log('Seeded competition ID:', comp._id.toString());
  await mongoose.disconnect();
}

seed().catch(console.error);
