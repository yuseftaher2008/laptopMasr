import { openDb } from "./config/db.js";

const laptops = [
  {
    name: "Dell G15 5530",
    brand: "Dell",
    price: 1200,
    cpu: "Intel i7-13650HX",
    ram: 16,
    storage: 512,
    gpu: "RTX 4050",
    screen_size: 15.6,
    stock: 5,
    tags: "gaming,dell",
    description: "Powerful gaming laptop with RTX 4050",
  },
  {
    name: "HP Pavilion 15",
    brand: "HP",
    price: 850,
    cpu: "Intel i5-1235U",
    ram: 8,
    storage: 512,
    gpu: "Intel Iris Xe",
    screen_size: 15.6,
    stock: 10,
    tags: "workspace,hp,student",
    description: "Good for daily work and study",
  },
  {
    name: "Lenovo Legion 5",
    brand: "Lenovo",
    price: 1400,
    cpu: "Ryzen 7 6800H",
    ram: 16,
    storage: 1,
    gpu: "RTX 3060",
    screen_size: 15.6,
    stock: 4,
    tags: "gaming,lenovo",
    description: "High performance gaming laptop",
  },
  {
    name: "ASUS TUF F15",
    brand: "ASUS",
    price: 1100,
    cpu: "Intel i7-12700H",
    ram: 16,
    storage: 512,
    gpu: "RTX 3050",
    screen_size: 15.6,
    stock: 6,
    tags: "gaming,asus",
    description: "Durable gaming machine",
  },
  {
    name: "MacBook Air M2",
    brand: "Apple",
    price: 1300,
    cpu: "Apple M2",
    ram: 8,
    storage: 256,
    gpu: "Integrated",
    screen_size: 13.6,
    stock: 8,
    tags: "workspace,apple,student",
    description: "Lightweight and fast laptop",
  },
];

// generate more fake laptops automatically
const brands = ["Dell", "HP", "Lenovo", "ASUS", "Acer"];
const cpus = ["i5", "i7", "Ryzen 5", "Ryzen 7"];
const gpus = ["RTX 3050", "RTX 3060", "RTX 4050", "Integrated"];

for (let i = 1; i <= 15; i++) {
  laptops.push({
    name: `Laptop Model ${i}`,
    brand: brands[i % brands.length],
    price: 600 + i * 80,
    cpu: cpus[i % cpus.length],
    ram: i % 2 === 0 ? 16 : 8,
    storage: 512,
    gpu: gpus[i % gpus.length],
    screen_size: 15.6,
    stock: 5 + (i % 5),
    tags: i % 2 === 0 ? "gaming" : "workspace",
    description: `Auto generated laptop ${i}`,
  });
}

async function seed() {
  const db = await openDb();

  try {
    await db.exec("PRAGMA foreign_keys = ON");

    for (const laptop of laptops) {
      await db.run(
        `INSERT INTO products 
        (name, brand, price, cpu, ram, storage, gpu, screen_size, stock, tags, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          laptop.name,
          laptop.brand,
          laptop.price,
          laptop.cpu,
          laptop.ram,
          laptop.storage,
          laptop.gpu,
          laptop.screen_size,
          laptop.stock,
          laptop.tags,
          laptop.description,
        ]
      );
    }

    console.log("✅ 20 laptops inserted successfully!");
  } catch (err) {
    console.log("❌ Seed error:", err.message);
  } finally {
    await db.close();
  }
}

seed()