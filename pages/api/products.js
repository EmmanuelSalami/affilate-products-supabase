import { Redis } from '@upstash/redis';

// Initialize Redis client with error handling
let redis;
try {
  redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
  
  console.log('Redis client initialized successfully');
  // Log partial URL to debug without revealing full credentials
  const partialUrl = process.env.KV_REST_API_URL ? 
    `${process.env.KV_REST_API_URL.substring(0, 15)}...` : 'undefined';
  console.log(`Redis URL (partial): ${partialUrl}`);
} catch (error) {
  console.error('Failed to initialize Redis client:', error);
}

// Helper function to read products from Redis
const readProducts = async () => {
  try {
    // Get the products from Redis
    const products = await redis.get('products');
    // Return empty array if no products exist yet
    return products || [];
  } catch (error) {
    console.error('Error reading products from Redis:', error);
    // In case of read error, return empty array to avoid crashing
    return [];
  }
};

// Helper function to write products to Redis
const writeProducts = async (products) => {
  try {
    // Store products in Redis
    await redis.set('products', products);
  } catch (error) {
    console.error('Error writing products to Redis:', error);
    // Throw an error for the handler to catch
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

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Handle GET request - return all products
    // No API key required for read operations
    try {
      const products = await readProducts();
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
          imageUrl: imageUrl || 'https://via.placeholder.com/200?text=No+Image', // Default image if not provided
          description: description || '', // Empty string if description not provided
          productUrl,
        };

        const products = await readProducts();
        products.push(newProduct);
        await writeProducts(products);

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