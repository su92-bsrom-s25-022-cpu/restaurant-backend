const menuSeedData = [
    // STARTERS
    {
        id: "s1",
        name: "Crispy Calamari Rings",
        description: "Golden fried squid rings with marinara sauce",
        price: 12.99,
        category: "starters",
        image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400",
        veg: false,
        spicy: 1,
        rating: 4.5,
        tags: ["seafood", "fried"]
    },
    {
        id: "s2",
        name: "Bruschetta Trio",
        description: "Toasted bread with tomato, basil & mozzarella",
        price: 10.99,
        category: "starters",
        image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400",
        veg: true,
        spicy: 0,
        rating: 4.6,
        tags: ["italian", "vegetarian"]
    },
    {
        id: "s3",
        name: "Buffalo Wings",
        description: "Spicy glazed wings with blue cheese dip",
        price: 14.99,
        category: "starters",
        image: "https://images.unsplash.com/photo-1608039829572-9479e1a51300?w=400",
        veg: false,
        spicy: 3,
        rating: 4.8,
        tags: ["chicken", "spicy"]
    },
    {
        id: "s4",
        name: "Spring Rolls",
        description: "Crispy vegetable rolls with sweet chili sauce",
        price: 9.99,
        category: "starters",
        image: "https://images.unsplash.com/photo-1548507200-e9e0e7e50e6f?w=400",
        veg: true,
        spicy: 1,
        rating: 4.3,
        tags: ["asian", "vegetarian"]
    },
    {
        id: "s5",
        name: "Garlic Prawns",
        description: "Sautéed prawns in garlic butter",
        price: 16.99,
        category: "starters",
        image: "https://images.unsplash.com/photo-1565680018093-ebb6e41db76d?w=400",
        veg: false,
        spicy: 1,
        rating: 4.7,
        tags: ["seafood", "garlic"]
    },

    // MAIN COURSE
    {
        id: "m1",
        name: "Wagyu Beef Steak",
        description: "Premium wagyu with truffle sauce & vegetables",
        price: 45.99,
        category: "main",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        veg: false,
        spicy: 0,
        rating: 4.9,
        tags: ["premium", "beef"]
    },
    {
        id: "m2",
        name: "Grilled Salmon",
        description: "Atlantic salmon with lemon dill sauce",
        price: 38.99,
        category: "main",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
        veg: false,
        spicy: 0,
        rating: 4.8,
        tags: ["fish", "healthy"]
    },
    {
        id: "m3",
        name: "Chicken Biryani",
        description: "Aromatic basmati rice with tender chicken",
        price: 22.99,
        category: "main",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
        veg: false,
        spicy: 2,
        rating: 4.9,
        tags: ["desi", "rice"]
    },
    {
        id: "m4",
        name: "Mushroom Risotto",
        description: "Creamy arborio rice with wild mushrooms",
        price: 24.99,
        category: "main",
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400",
        veg: true,
        spicy: 0,
        rating: 4.6,
        tags: ["italian", "vegetarian"]
    },
    {
        id: "m5",
        name: "Lamb Chops",
        description: "Herb-crusted New Zealand lamb chops",
        price: 42.99,
        category: "main",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
        veg: false,
        spicy: 1,
        rating: 4.7,
        tags: ["lamb", "premium"]
    },
    {
        id: "m6",
        name: "Paneer Tikka Masala",
        description: "Cottage cheese in rich tomato gravy",
        price: 19.99,
        category: "main",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
        veg: true,
        spicy: 2,
        rating: 4.5,
        tags: ["indian", "vegetarian"]
    },
    {
        id: "m7",
        name: "Fish & Chips",
        description: "Beer-battered cod with crispy chips",
        price: 21.99,
        category: "main",
        image: "https://images.unsplash.com/photo-1534766555764-ce878a4e947e?w=400",
        veg: false,
        spicy: 0,
        rating: 4.4,
        tags: ["british", "fish"]
    },
    {
        id: "m8",
        name: "Pasta Carbonara",
        description: "Creamy pasta with pancetta & parmesan",
        price: 20.99,
        category: "main",
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
        veg: false,
        spicy: 0,
        rating: 4.6,
        tags: ["italian", "pasta"]
    },

    // DESSERTS
    {
        id: "d1",
        name: "Tiramisu",
        description: "Classic Italian coffee-flavored dessert",
        price: 12.99,
        category: "desserts",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
        veg: true,
        spicy: 0,
        rating: 4.8,
        tags: ["italian", "coffee"]
    },
    {
        id: "d2",
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with molten center",
        price: 14.99,
        category: "desserts",
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400",
        veg: true,
        spicy: 0,
        rating: 4.9,
        tags: ["chocolate", "warm"]
    },
    {
        id: "d3",
        name: "Crème Brûlée",
        description: "French vanilla custard with caramelized sugar",
        price: 11.99,
        category: "desserts",
        image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400",
        veg: true,
        spicy: 0,
        rating: 4.7,
        tags: ["french", "vanilla"]
    },
    {
        id: "d4",
        name: "Mango Cheesecake",
        description: "Creamy cheesecake with fresh mango topping",
        price: 13.99,
        category: "desserts",
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400",
        veg: true,
        spicy: 0,
        rating: 4.5,
        tags: ["cheesecake", "mango"]
    },

    // BEVERAGES
    {
        id: "b1",
        name: "Mango Smoothie",
        description: "Fresh mango blended with yogurt",
        price: 7.99,
        category: "beverages",
        image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400",
        veg: true,
        spicy: 0,
        rating: 4.6,
        tags: ["smoothie", "fruit"]
    },
    {
        id: "b2",
        name: "Iced Matcha Latte",
        description: "Premium matcha with oat milk",
        price: 6.99,
        category: "beverages",
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400",
        veg: true,
        spicy: 0,
        rating: 4.5,
        tags: ["coffee", "matcha"]
    },
    {
        id: "b3",
        name: "Fresh Mint Mojito",
        description: "Refreshing mint with lime & soda",
        price: 8.99,
        category: "beverages",
        image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400",
        veg: true,
        spicy: 0,
        rating: 4.7,
        tags: ["mocktail", "refreshing"]
    },
    {
        id: "b4",
        name: "Espresso Martini",
        description: "Rich espresso cocktail",
        price: 12.99,
        category: "beverages",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
        veg: true,
        spicy: 0,
        rating: 4.8,
        tags: ["cocktail", "coffee"]
    },

    // CHEF'S SPECIAL
    {
        id: "cs1",
        name: "Truffle Lobster Risotto",
        description: "Black truffle risotto with Maine lobster tail",
        price: 58.99,
        category: "special",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400",
        veg: false,
        spicy: 0,
        rating: 5.0,
        tags: ["premium", "lobster", "truffle"]
    },
    {
        id: "cs2",
        name: "Dragon Fire Sushi Platter",
        description: "12-piece premium sushi with dragon sauce",
        price: 42.99,
        category: "special",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
        veg: false,
        spicy: 3,
        rating: 4.9,
        tags: ["sushi", "japanese", "spicy"]
    },
    {
        id: "cs3",
        name: "Gold Leaf Chocolate Sphere",
        description: "24K gold chocolate dome with raspberry",
        price: 24.99,
        category: "special",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
        veg: true,
        spicy: 0,
        rating: 4.9,
        tags: ["dessert", "premium", "chocolate"]
    }
];

module.exports = { menuSeedData };
