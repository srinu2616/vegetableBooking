const Vegetable = require('../models/Vegetable');

// @desc    Get all vegetables with filtering
// @route   GET /api/vegetables
// @access  Public
const getVegetables = async (req, res) => {
    try {
        const { keyword, category, sort, priceMin, priceMax } = req.query;

        let query = {};

        // Search by keyword
        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        }

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Filter by price range
        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin) query.price.$gte = Number(priceMin);
            if (priceMax) query.price.$lte = Number(priceMax);
        }

        // Sorting
        let sortOption = {};
        if (sort === 'price_asc') sortOption.price = 1;
        else if (sort === 'price_desc') sortOption.price = -1;
        else if (sort === 'rating') sortOption.rating = -1;
        else if (sort === 'oldest') sortOption.createdAt = 1;
        else sortOption.createdAt = 1; // Default to oldest (First added = Top)

        const vegetables = await Vegetable.find(query).sort(sortOption);

        res.json(vegetables);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single vegetable
// @route   GET /api/vegetables/:id
// @access  Public
const getVegetableById = async (req, res) => {
    try {
        const vegetable = await Vegetable.findById(req.params.id);

        if (vegetable) {
            res.json(vegetable);
        } else {
            res.status(404).json({ message: 'Vegetable not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new vegetable (Admin)
// @route   POST /api/vegetables
// @access  Private/Admin
const createVegetable = async (req, res) => {
    try {
        const { name, price, description, shortDescription, category, stock, unit, packSize, isOrganic, images } = req.body;

        // Ensure images is an array of non-empty strings
        let imageArray = [];
        if (images) {
            if (Array.isArray(images)) {
                imageArray = images.filter(img => img.trim() !== '');
            } else {
                imageArray = [images].filter(img => img.trim() !== '');
            }
        }

        const vegetable = await Vegetable.create({
            name,
            price,
            description,
            shortDescription,
            category,
            stock,
            unit,
            packSize: packSize || 1,
            isOrganic,
            images: imageArray
        });

        res.status(201).json(vegetable);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Seed sample data
// @route   POST /api/vegetables/seed
// @access  Public (for dev)
const seedVegetables = async (req, res) => {
    try {
        await Vegetable.deleteMany();

        const sampleData = [
            {
                name: 'Fresh Spinach',
                description: 'Organic fresh spinach leaves, rich in iron.',
                price: 40,
                category: 'Leafy',
                images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                stock: 50,
                unit: 'bunch',
                packSize: 1,
                rating: 4.8,
                isOrganic: true
            },
            {
                name: 'Red Tomato',
                description: 'Juicy red tomatoes, perfect for salads and curries.',
                price: 30,
                category: 'Fruit',
                images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                stock: 100,
                unit: 'kg',
                packSize: 1,
                rating: 4.5,
                isOrganic: false
            },
            {
                name: 'Carrot',
                description: 'Crunchy orange carrots, sweet and healthy.',
                price: 60,
                category: 'Root',
                images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                stock: 80,
                unit: 'kg',
                packSize: 1,
                rating: 4.7,
                isOrganic: true
            },
            {
                name: 'Broccoli',
                description: 'Fresh green broccoli heads, high in fiber.',
                price: 120,
                category: 'Leafy', // Botanically flower, but often grouped with greens/cruciferous
                images: ['https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                stock: 30,
                unit: 'kg',
                packSize: 1,
                rating: 4.9,
                isOrganic: true
            },
            {
                name: 'Potato',
                description: 'Versatile potatoes, staple for every kitchen.',
                price: 25,
                category: 'Root',
                images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                stock: 200,
                unit: 'kg',
                packSize: 1,
                rating: 4.3,
                isOrganic: false
            }
        ];

        const createdVegetables = await Vegetable.insertMany(sampleData);
        res.json(createdVegetables);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Seed failed' });
    }
}

// @desc    Delete vegetable (Admin)
// @route   DELETE /api/vegetables/:id
// @access  Private/Admin
const deleteVegetable = async (req, res) => {
    try {
        const vegetable = await Vegetable.findById(req.params.id);

        if (vegetable) {
            await vegetable.deleteOne();
            res.json({ message: 'Vegetable removed' });
        } else {
            res.status(404).json({ message: 'Vegetable not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update vegetable (Admin)
// @route   PUT /api/vegetables/:id
// @access  Private/Admin
const updateVegetable = async (req, res) => {
    try {
        const { name, price, description, shortDescription, category, stock, unit, packSize, isOrganic, images } = req.body;

        const vegetable = await Vegetable.findById(req.params.id);

        if (vegetable) {
            vegetable.name = name || vegetable.name;
            vegetable.price = price || vegetable.price;
            vegetable.description = description || vegetable.description;
            vegetable.shortDescription = shortDescription || vegetable.shortDescription;
            vegetable.category = category || vegetable.category;
            vegetable.stock = stock || vegetable.stock;
            vegetable.unit = unit || vegetable.unit;
            vegetable.packSize = packSize || vegetable.packSize;
            vegetable.isOrganic = isOrganic !== undefined ? isOrganic : vegetable.isOrganic;

            // Update images if provided
            if (images) {
                let imageArray = [];
                if (Array.isArray(images)) {
                    imageArray = images.filter(img => img.trim() !== '');
                } else {
                    imageArray = [images].filter(img => img.trim() !== '');
                }
                vegetable.images = imageArray;
            }

            const updatedVegetable = await vegetable.save();
            res.json(updatedVegetable);
        } else {
            res.status(404).json({ message: 'Vegetable not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getVegetables,
    getVegetableById,
    createVegetable,
    deleteVegetable,
    updateVegetable,
    seedVegetables
};
