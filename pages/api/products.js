import fs from 'fs';
import path from 'path';

// Helper function to get the full path to the JSON file
const getProductsFilePath = () => {
  // Go up two levels from pages/api to the project root, then into data/
  return path.join(process.cwd(), 'data', 'products.json');
};

// Helper function to read products from the JSON file
const readProducts = () => {
  const filePath = getProductsFilePath();
  try {
    // Check if file exists before reading
    if (!fs.existsSync(filePath)) {
        // If it doesn't exist (e.g., first run), return an empty array
        return [];
    }
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    // Handle empty file case
    if (!jsonData) {
        return [];
    }
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading products file:', error);
    // In case of read error, return empty array to avoid crashing
    return [];
  }
};

// Helper function to write products to the JSON file
const writeProducts = (products) => {
  const filePath = getProductsFilePath();
  try {
    const dataDir = path.dirname(filePath);
    // Ensure the data directory exists
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2)); // Pretty print JSON
  } catch (error) {
    console.error('Error writing products file:', error);
    // Optionally, re-throw or handle the error appropriately
    throw new Error('Failed to save product data.');
  }
};

// Helper function to verify API key
const isValidApiKey = (apiKey) => {
  // Get the API key from environment variables
  const validApiKey = process.env.API_KEY;
  
  // If no API key is set in environment, consider it an error
  if (!validApiKey) {
    console.error('API_KEY not set in environment variables');
    return false;
  }
  
  // Compare the provided API key with the valid one
  return apiKey === validApiKey;
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Handle GET request - return all products
    // No API key required for read operations
    try {
      const products = readProducts();
      res.status(200).json(products);
    } catch (error) {
        console.error("GET /api/products error:", error);
        res.status(500).json({ message: 'Error fetching products' });
    }
  } else if (req.method === 'POST') {
    // Handle POST request - add a new product
    // API key required for write operations
    
    // Check for API key in headers
    const apiKey = req.headers['x-api-key'];
    
    // If API key is missing or invalid, return 401 Unauthorized
    if (!apiKey || !isValidApiKey(apiKey)) {
      return res.status(401).json({ 
        message: 'Unauthorized: Valid API key required' 
      });
    }
    
    try {
        const { title, imageUrl, description, productUrl } = req.body;

        // Basic validation - only title and productUrl are required
        if (!title || !productUrl) {
          return res.status(400).json({ 
            message: 'Missing required fields: title and productUrl are required' 
          });
        }

        const newProduct = {
          id: Date.now().toString(), // Simple unique ID using timestamp
          title,
          imageUrl: imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930', // Default image if not provided
          description: description || '', // Empty string if description not provided
          productUrl,
        };

        const products = readProducts();
        products.push(newProduct);
        writeProducts(products);

        res.status(201).json({ message: 'Product added successfully', product: newProduct });

    } catch (error) {
         console.error("POST /api/products error:", error);
         // Check if it's a file writing error we threw
         if (error.message === 'Failed to save product data.') {
             res.status(500).json({ message: error.message });
         } else {
             res.status(500).json({ message: 'Error adding product' });
         }
    }
  } else {
    // Handle unsupported methods
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 