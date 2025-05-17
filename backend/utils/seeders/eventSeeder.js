const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const Event = require("../../models/eventModel");
const Category = require("../../models/categoryModel");

dotenv.config({ path: "config.env" });

const sampleEvents = [
  {
    _id: "11111111-0000-0000-0000-000000000001",
    category: "8f41eeb3-b7d6-4b2a-9c94-222222222222", // Technology
    name: { en: "Tech Conference", ar: "مؤتمر التقنية" },
    description: {
      en: "Explore latest in tech",
      ar: "استكشاف أحدث التقنيات",
    },
    venue: { en: "Cairo IT Hall", ar: "قاعة تكنولوجيا القاهرة" },
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    price: 100,
    ticketQuantity: 100,
    soldTickets: 0,
    image: "tech-conference.jpg",
  },
  {
    _id: "11111111-0000-0000-0000-000000000002",
    category: "8f41eeb3-b7d6-4b2a-9c94-111111111111", // Fitness
    name: { en: "Fitness Bootcamp", ar: "معسكر اللياقة" },
    description: {
      en: "Train with pros",
      ar: "تدريب مع المحترفين",
    },
    venue: { en: "Giza Gym Center", ar: "مركز الجيزة الرياضي" },
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    price: 50,
    ticketQuantity: 50,
    soldTickets: 0,
    image: "fitness-bootcamp.jpg",
  },
  {
    _id: "11111111-0000-0000-0000-000000000003",
    category: "8f41eeb3-b7d6-4b2a-9c94-333333333333", // Business
    name: { en: "Startup Meetup", ar: "لقاء الشركات الناشئة" },
    description: {
      en: "Network and pitch",
      ar: "شبّك وقدم عرضك",
    },
    venue: { en: "Smart Village", ar: "القرية الذكية" },
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    price: 30,
    ticketQuantity: 0, // open event
    soldTickets: 0,
    image: "startup-meetup.jpg",
  },
  {
    _id: "11111111-0000-0000-0000-000000000004",
    category: "8f41eeb3-b7d6-4b2a-9c94-444444444444", // Music
    name: { en: "Music Festival", ar: "مهرجان الموسيقى" },
    description: {
      en: "Live performances",
      ar: "عروض مباشرة",
    },
    venue: { en: "Downtown Park", ar: "حديقة وسط البلد" },
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    price: 200,
    ticketQuantity: 300,
    soldTickets: 0,
    image: "music-festival.jpg",
  },
  {
    _id: "11111111-0000-0000-0000-000000000005",
    category: "8f41eeb3-b7d6-4b2a-9c94-555555555555", // Art
    name: { en: "Art Workshop", ar: "ورشة الفن" },
    description: {
      en: "Hands-on training",
      ar: "تدريب عملي",
    },
    venue: { en: "Alexandria Gallery", ar: "معرض الإسكندرية" },
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    price: 75,
    ticketQuantity: 40,
    soldTickets: 0,
    image: "art-workshop.jpg",
  },
];

async function seedEvents() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("✅ MongoDB connected for event seeding");

    await Event.deleteMany();

    const categories = await Category.find({});
    if (!categories.length) {
      console.error("❌ No categories found. Seed categories first.");
      process.exit(1);
    }

    const eventsToInsert = sampleEvents.map((event) => {
      const category =
        categories[Math.floor(Math.random() * categories.length)];

      const slug = event.name.en.toLowerCase().replace(/\s+/g, "-");
      return {
        _id: uuidv4(),
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...event,
        category: category._id,
        soldTickets: 0,
        image: `${slug}.jpg`,
      };
    });

    await Event.insertMany(eventsToInsert);
    console.log("✅ Events seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Event seeding failed", err);
    process.exit(1);
  }
}

seedEvents();
