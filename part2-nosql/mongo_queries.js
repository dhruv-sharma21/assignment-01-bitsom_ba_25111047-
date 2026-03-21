// =============================================================
//  mongo_queries.js
//  MongoDB Operations — E-Commerce Product Catalog
//  Database : ecommerce_db
//  Collection: products
// =============================================================

// Assumes you are connected to MongoDB and have selected the database:
//   use ecommerce_db

// -------------------------------------------------------------
// OP1: insertMany() — insert all 3 documents from sample_documents.json
// -------------------------------------------------------------
// Inserts one document per product category (Electronics, Clothing, Groceries)
// in a single atomic batch operation.

db.products.insertMany([
  {
    "_id": ObjectId("64f1a2b3c4d5e6f7a8b9c001"),
    "product_id": "ELEC-001",
    "category": "Electronics",
    "name": "Samsung Galaxy S24 Ultra",
    "brand": "Samsung",
    "price": 124999,
    "currency": "INR",
    "stock": 45,
    "specifications": {
      "display": "6.8-inch Dynamic AMOLED 2X",
      "processor": "Snapdragon 8 Gen 3",
      "ram_gb": 12,
      "storage_gb": 256,
      "battery_mah": 5000,
      "voltage": "5V / 3A (15W standard), 45W fast charging",
      "camera_mp": {
        "rear_main": 200,
        "rear_ultra_wide": 12,
        "rear_telephoto": 10,
        "front": 12
      },
      "connectivity": ["5G", "Wi-Fi 6E", "Bluetooth 5.3", "NFC", "USB-C 3.2"]
    },
    "warranty": {
      "duration_months": 12,
      "type": "Manufacturer Warranty",
      "covers": ["Manufacturing defects", "Hardware failures"],
      "excludes": ["Physical damage", "Water damage"]
    },
    "ratings": { "average": 4.7, "total_reviews": 3812 },
    "tags": ["smartphone", "android", "5g", "flagship"],
    "created_at": new Date("2024-01-15T10:00:00Z"),
    "updated_at": new Date("2024-11-01T08:30:00Z")
  },
  {
    "_id": ObjectId("64f1a2b3c4d5e6f7a8b9c002"),
    "product_id": "CLTH-001",
    "category": "Clothing",
    "name": "Men's Slim Fit Formal Shirt",
    "brand": "Arrow",
    "price": 1299,
    "currency": "INR",
    "stock": 210,
    "details": {
      "fabric": "60% Cotton, 40% Polyester",
      "fit": "Slim Fit",
      "sleeve": "Full Sleeve",
      "collar": "Spread Collar",
      "care_instructions": [
        "Machine wash cold",
        "Do not bleach",
        "Tumble dry low",
        "Iron on medium heat"
      ],
      "occasion": ["Formal", "Business Casual"]
    },
    "variants": [
      { "color": "White",       "sizes_available": ["S", "M", "L", "XL", "XXL"] },
      { "color": "Light Blue",  "sizes_available": ["S", "M", "L", "XL"] },
      { "color": "Navy Stripe", "sizes_available": ["M", "L", "XL"] }
    ],
    "size_chart": {
      "S":   { "chest_cm": 91,  "shoulder_cm": 42 },
      "M":   { "chest_cm": 96,  "shoulder_cm": 44 },
      "L":   { "chest_cm": 101, "shoulder_cm": 46 },
      "XL":  { "chest_cm": 106, "shoulder_cm": 48 },
      "XXL": { "chest_cm": 111, "shoulder_cm": 50 }
    },
    "ratings": { "average": 4.3, "total_reviews": 925 },
    "tags": ["formal", "men", "shirt", "office-wear"],
    "created_at": new Date("2024-03-10T09:00:00Z"),
    "updated_at": new Date("2024-10-20T11:15:00Z")
  },
  {
    "_id": ObjectId("64f1a2b3c4d5e6f7a8b9c003"),
    "product_id": "GROC-001",
    "category": "Groceries",
    "name": "Amul Gold Full Cream Milk",
    "brand": "Amul",
    "price": 68,
    "currency": "INR",
    "stock": 500,
    "packaging": {
      "type": "Tetra Pack",
      "volume_ml": 1000,
      "units_per_case": 12
    },
    "dates": {
      "manufactured":    new Date("2024-11-20T00:00:00Z"),
      "expiry":          new Date("2024-12-20T00:00:00Z"),
      "best_before_days": 30
    },
    "nutritional_info": {
      "serving_size_ml": 100,
      "energy_kcal": 62,
      "protein_g": 3.2,
      "carbohydrates_g": 4.8,
      "sugar_g": 4.8,
      "fat_g": 3.5,
      "saturated_fat_g": 2.1,
      "calcium_mg": 120,
      "vitamins": ["Vitamin A", "Vitamin D"]
    },
    "storage_instructions": "Keep refrigerated at 4°C or below. Consume within 2 days of opening.",
    "certifications": ["FSSAI", "ISO 22000", "BIS"],
    "fssai_license": "10013022002253",
    "allergens": ["Milk and milk products"],
    "ratings": { "average": 4.6, "total_reviews": 7241 },
    "tags": ["dairy", "milk", "fresh", "daily-essentials"],
    "created_at": new Date("2024-11-20T05:00:00Z"),
    "updated_at": new Date("2024-11-20T05:00:00Z")
  }
]);

// Expected output:
// { acknowledged: true, insertedIds: { '0': ObjectId(...), '1': ObjectId(...), '2': ObjectId(...) } }


// -------------------------------------------------------------
// OP2: find() — retrieve all Electronics products with price > 20000
// -------------------------------------------------------------
// Filters by both category and a numeric price threshold.
// The projection (second argument) returns only the fields useful
// for a product-listing page; _id is suppressed for cleaner output.

db.products.find(
  {
    category: "Electronics",
    price: { $gt: 20000 }
  },
  {
    _id: 0,
    product_id: 1,
    name: 1,
    brand: 1,
    price: 1,
    "ratings.average": 1
  }
);

// Expected output (sample):
// [
//   { product_id: 'ELEC-001', name: 'Samsung Galaxy S24 Ultra',
//     brand: 'Samsung', price: 124999, ratings: { average: 4.7 } }
// ]


// -------------------------------------------------------------
// OP3: find() — retrieve all Groceries expiring before 2025-01-01
// -------------------------------------------------------------
// Queries the nested field "dates.expiry" using a $lt (less than)
// comparison on a JavaScript Date object.
// This is useful for shelf-life management and alerting stock teams.

db.products.find(
  {
    category: "Groceries",
    "dates.expiry": { $lt: new Date("2025-01-01T00:00:00Z") }
  },
  {
    _id: 0,
    product_id: 1,
    name: 1,
    "dates.expiry": 1,
    stock: 1
  }
);

// Expected output (sample):
// [
//   { product_id: 'GROC-001', name: 'Amul Gold Full Cream Milk',
//     dates: { expiry: ISODate('2024-12-20T00:00:00Z') }, stock: 500 }
// ]


// -------------------------------------------------------------
// OP4: updateOne() — add a "discount_percent" field to a specific product
// -------------------------------------------------------------
// Targets the Clothing product (CLTH-001) by its unique product_id.
// $set adds the new field without overwriting the rest of the document.
// $currentDate keeps the "updated_at" timestamp accurate.

db.products.updateOne(
  { product_id: "CLTH-001" },
  {
    $set: {
      discount_percent: 15
    },
    $currentDate: {
      updated_at: true
    }
  }
);

// Verification — confirm the field was added:
db.products.findOne(
  { product_id: "CLTH-001" },
  { _id: 0, product_id: 1, name: 1, price: 1, discount_percent: 1, updated_at: 1 }
);

// Expected output:
// { product_id: 'CLTH-001', name: "Men's Slim Fit Formal Shirt",
//   price: 1299, discount_percent: 15, updated_at: ISODate('...') }


// -------------------------------------------------------------
// OP5: createIndex() — create an index on category field
// -------------------------------------------------------------
// WHY THIS INDEX?
//
// Almost every query in this catalog filters by `category`
// (OP2 filters Electronics, OP3 filters Groceries, etc.).
// Without an index, MongoDB performs a full collection scan (COLLSCAN)
// examining every document, which degrades to O(n) as the catalog grows.
//
// With this index, MongoDB uses an index scan (IXSCAN), narrowing the
// search space instantly to only the matching category — typically O(log n).
//
// A compound index { category: 1, price: 1 } is chosen over a single-field
// index because it simultaneously accelerates:
//   • Category-only filters  (OP2, OP3 category match)
//   • Category + price range filters  (OP2 price > 20000)
// MongoDB's "leftmost prefix" rule means { category: 1 } queries still use
// this index, so we get two query patterns covered with one index.

db.products.createIndex(
  { category: 1, price: 1 },
  {
    name: "idx_category_price",
    background: true   // non-blocking build on existing data
  }
);

// Verify the index was created:
db.products.getIndexes();

// Use explain() to confirm IXSCAN is used instead of COLLSCAN:
db.products.find({ category: "Electronics", price: { $gt: 20000 } })
           .explain("executionStats");

// In the explain output, look for:
//   "winningPlan.stage": "IXSCAN"      ← index is being used ✓
//   "totalDocsExamined" << totalDocs   ← fewer docs scanned ✓
