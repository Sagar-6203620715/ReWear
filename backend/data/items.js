const items = [
  {
    name: "Vintage Denim Jacket",
    category: "Outerwear",
    size: "M",
    condition: "Good",
    description: "Classic vintage denim jacket in excellent condition. Perfect for layering. Features a comfortable fit and timeless style that goes with everything.",
    brand: "Levi's",
    color: "Blue",
    material: "Denim",
    images: [
      "https://picsum.photos/seed/jacket1/400/500",
      "https://picsum.photos/seed/jacket1b/400/500"
    ],
    location: "New York, NY"
  },
  {
    name: "Summer Floral Dress",
    category: "Dresses",
    size: "S",
    condition: "Like New",
    description: "Beautiful floral print dress, barely worn. Perfect for summer events and casual outings. Light and breathable fabric.",
    brand: "Zara",
    color: "Floral",
    material: "Cotton",
    images: [
      "https://picsum.photos/seed/dress1/400/500",
      "https://picsum.photos/seed/dress1b/400/500"
    ],
    location: "Los Angeles, CA"
  },
  {
    name: "Leather Crossbody Bag",
    category: "Accessories",
    size: "One Size",
    condition: "Excellent",
    description: "Genuine leather crossbody bag with adjustable strap. Great for everyday use. Features multiple compartments and durable construction.",
    brand: "Coach",
    color: "Brown",
    material: "Leather",
    images: [
      "https://picsum.photos/seed/bag1/400/500",
      "https://picsum.photos/seed/bag1b/400/500"
    ],
    location: "Chicago, IL"
  },
  {
    name: "Cotton T-Shirt Collection",
    category: "Tops",
    size: "L",
    condition: "Good",
    description: "Set of 3 cotton t-shirts in various colors. All in good condition. Perfect for everyday wear and layering.",
    brand: "H&M",
    color: "Mixed",
    material: "Cotton",
    images: [
      "https://picsum.photos/seed/tshirt1/400/500",
      "https://picsum.photos/seed/tshirt1b/400/500"
    ],
    location: "Austin, TX"
  },
  {
    name: "High-Waisted Jeans",
    category: "Bottoms",
    size: "Custom",
    condition: "Excellent",
    description: "High-waisted skinny jeans in dark wash. Perfect fit and condition. Stretchy material for comfort.",
    brand: "American Eagle",
    color: "Dark Blue",
    material: "Denim",
    images: [
      "https://picsum.photos/seed/jeans1/400/500",
      "https://picsum.photos/seed/jeans1b/400/500"
    ],
    location: "Seattle, WA"
  },
  {
    name: "Wool Sweater",
    category: "Sweaters",
    size: "M",
    condition: "Good",
    description: "Cozy wool sweater in navy blue. Great for cold weather. Soft and warm material.",
    brand: "Gap",
    color: "Navy Blue",
    material: "Wool",
    images: [
      "https://picsum.photos/seed/sweater1/400/500",
      "https://picsum.photos/seed/sweater1b/400/500"
    ],
    location: "Boston, MA"
  },
  {
    name: "Silk Blouse",
    category: "Tops",
    size: "S",
    condition: "Like New",
    description: "Elegant silk blouse in cream color. Perfect for professional settings. Smooth and luxurious fabric.",
    brand: "Banana Republic",
    color: "Cream",
    material: "Silk",
    images: [
      "https://picsum.photos/seed/blouse1/400/500",
      "https://picsum.photos/seed/blouse1b/400/500"
    ],
    location: "Miami, FL"
  },
  {
    name: "Leather Boots",
    category: "Shoes",
    size: "Custom",
    condition: "Excellent",
    description: "Classic leather boots with minimal wear. Great for outdoor activities and casual wear.",
    brand: "Dr. Martens",
    color: "Black",
    material: "Leather",
    images: [
      "https://picsum.photos/seed/boots1/400/500",
      "https://picsum.photos/seed/boots1b/400/500"
    ],
    location: "Denver, CO"
  },
  {
    name: "Knit Cardigan",
    category: "Sweaters",
    size: "L",
    condition: "Good",
    description: "Soft knit cardigan in beige. Perfect for layering in any season. Comfortable and versatile.",
    brand: "Old Navy",
    color: "Beige",
    material: "Acrylic",
    images: [
      "https://picsum.photos/seed/cardigan1/400/500",
      "https://picsum.photos/seed/cardigan1b/400/500"
    ],
    location: "Portland, OR"
  },
  {
    name: "Pencil Skirt",
    category: "Bottoms",
    size: "M",
    condition: "Excellent",
    description: "Professional pencil skirt in black. Ideal for office wear. Classic cut and comfortable fit.",
    brand: "Ann Taylor",
    color: "Black",
    material: "Polyester",
    images: [
      "https://picsum.photos/seed/skirt1/400/500",
      "https://picsum.photos/seed/skirt1b/400/500"
    ],
    location: "Atlanta, GA"
  },
  {
    name: "Denim Shirt",
    category: "Tops",
    size: "M",
    condition: "Good",
    description: "Classic denim shirt with a modern fit. Versatile for casual wear. Durable and stylish.",
    brand: "Gap",
    color: "Blue",
    material: "Denim",
    images: [
      "https://picsum.photos/seed/denimshirt1/400/500",
      "https://picsum.photos/seed/denimshirt1b/400/500"
    ],
    location: "Nashville, TN"
  },
  {
    name: "Winter Coat",
    category: "Outerwear",
    size: "L",
    condition: "Excellent",
    description: "Warm winter coat in dark green. Perfect for cold weather. Insulated and waterproof.",
    brand: "Columbia",
    color: "Dark Green",
    material: "Nylon",
    images: [
      "https://picsum.photos/seed/coat1/400/500",
      "https://picsum.photos/seed/coat1b/400/500"
    ],
    location: "Minneapolis, MN"
  },
  {
    name: "Summer Shorts",
    category: "Bottoms",
    size: "S",
    condition: "Like New",
    description: "Comfortable summer shorts in light blue. Barely worn. Perfect for hot weather.",
    brand: "Target",
    color: "Light Blue",
    material: "Cotton",
    images: [
      "https://picsum.photos/seed/shorts1/400/500",
      "https://picsum.photos/seed/shorts1b/400/500"
    ],
    location: "San Diego, CA"
  },
  {
    name: "Statement Necklace",
    category: "Accessories",
    size: "One Size",
    condition: "Excellent",
    description: "Beautiful statement necklace with colorful beads. Eye-catching accessory for special occasions.",
    brand: "Forever 21",
    color: "Multi-color",
    material: "Mixed",
    images: [
      "https://picsum.photos/seed/necklace1/400/500",
      "https://picsum.photos/seed/necklace1b/400/500"
    ],
    location: "Phoenix, AZ"
  },
  {
    name: "Athletic Leggings",
    category: "Activewear",
    size: "M",
    condition: "Good",
    description: "High-quality athletic leggings. Great for workouts and casual wear. Moisture-wicking fabric.",
    brand: "Nike",
    color: "Black",
    material: "Polyester",
    images: [
      "https://picsum.photos/seed/leggings1/400/500",
      "https://picsum.photos/seed/leggings1b/400/500"
    ],
    location: "Salt Lake City, UT"
  },
  {
    name: "Formal Dress",
    category: "Dresses",
    size: "L",
    condition: "Like New",
    description: "Elegant formal dress in navy blue. Perfect for special occasions. Sophisticated design.",
    brand: "Macy's",
    color: "Navy Blue",
    material: "Polyester",
    images: [
      "https://picsum.photos/seed/formal1/400/500",
      "https://picsum.photos/seed/formal1b/400/500"
    ],
    location: "Las Vegas, NV"
  }
];

module.exports = items; 