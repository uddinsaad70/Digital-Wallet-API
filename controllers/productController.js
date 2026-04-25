import Product from '../models/Product.js';

//@desc Create a new product
//@route POST /api/products
//@access Private/Admin
export const createProduct = async (req, res) => {
    try {
        const { name, price, description, stock } = req.body;
        //Create the product in the database
        const product = await Product.create({
            name,
            price,
            description,
            stock
        });
        console.log(`New product added: ${product.name} (ID: ${product._id})`);
        res.status(201).json({message: "Product created successfully", product});
    
    } catch (error) {
        console.error(`Error creating product: ${error.message}`);
        res.status(500).json({ message: 'Server error while creating product' });
    }
};

//@desc Get all products
//@route GET /api/products
//@access Public
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    
    } catch (error) {
        console.error(`Error fetching products: ${error.message}`);
        res.status(500).json({ message: 'Server error while fetching products' });
    }
};