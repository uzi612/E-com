export const initialCategories = [
  {
    _id: 'cat_electronics',
    name: 'Electronics',
    description: 'Gadgets, smartphones, audio, and high-tech devices.',
  },
  {
    _id: 'cat_fashion',
    name: 'Fashion',
    description: 'Trendy clothing, stylish outerwear, and premium accessories.',
  },
  {
    _id: 'cat_shoes',
    name: 'Shoes',
    description: 'Athletic, casual, and performance sneakers for every occasion.',
  },
];

export const initialProducts = [
  {
    _id: 'prod_1',
    name: 'Smart Phone Pro X',
    description: 'Flagship OLED 120Hz display with cutting-edge processor, triple lens camera system, and 256GB high-speed storage.',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    category: {
      _id: 'cat_electronics',
      name: 'Electronics',
    },
    stock: 15,
  },
  {
    _id: 'prod_2',
    name: 'Wireless Noise Cancelling Headphones',
    description: 'Studio-grade acoustic sound with active adaptive noise cancellation, plush memory foam earcups, and 30-hour battery life.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    category: {
      _id: 'cat_electronics',
      name: 'Electronics',
    },
    stock: 25,
  },
  {
    _id: 'prod_3',
    name: 'Classic Vintage Leather Jacket',
    description: 'Handcrafted genuine top-grain leather jacket with warm insulated lining, heavy-duty metal zippers, and timeless moto silhouette.',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    category: {
      _id: 'cat_fashion',
      name: 'Fashion',
    },
    stock: 8,
  },
  {
    _id: 'prod_4',
    name: 'AeroGlide Running Shoes',
    description: 'Lightweight breathable mesh upper with responsive carbon-infused foam cushioning engineered for long-distance comfort and endurance.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    category: {
      _id: 'cat_shoes',
      name: 'Shoes',
    },
    stock: 18,
  },
  {
    _id: 'prod_5',
    name: 'Apex Smart Watch Ultra',
    description: 'Titanium chassis, AMOLED sapphire crystal display, ECG monitoring, built-in GPS tracking, and 7-day battery stamina.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    category: {
      _id: 'cat_electronics',
      name: 'Electronics',
    },
    stock: 12,
  },
  {
    _id: 'prod_6',
    name: 'Urban Oversized Heavyweight Hoodie',
    description: '100% organic French terry cotton with relaxed dropped shoulders, double-layered hood, and durable ribbed cuffs.',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    category: {
      _id: 'cat_fashion',
      name: 'Fashion',
    },
    stock: 30,
  },
  {
    _id: 'prod_7',
    name: 'TrailMaster All-Terrain Hiking Boots',
    description: 'Waterproof Gore-Tex membrane, Vibram high-traction rubber outsole, and reinforced rubber toe cap for rugged terrain.',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80',
    category: {
      _id: 'cat_shoes',
      name: 'Shoes',
    },
    stock: 5,
  },
  {
    _id: 'prod_8',
    name: 'Minimalist Minimal Desk Soundbar',
    description: 'Compact stereo desktop soundbar with Bluetooth 5.3, dual passive radiators, customizable RGB accents, and AUX input.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    category: {
      _id: 'cat_electronics',
      name: 'Electronics',
    },
    stock: 0, // Out of stock demo
  },
];
