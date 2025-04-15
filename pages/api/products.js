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

// Helper function to validate API key
const validateApiKey = (req) => {
  // Get API key from various sources
  const apiKey = req.headers['x-api-key'] || req.query.api_key || (req.body && req.body.api_key);
  
  // Skip API key validation in development mode or when accessing from same origin
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Skipping API key validation');
    return true;
  }
  
  // Check for API key from same origin (our frontend)
  const referer = req.headers.referer || '';
  const host = req.headers.host || '';
  
  if (referer && referer.includes(host)) {
    console.log('Same origin request detected, allowing access');
    return true;
  }
  
  // Validate API key for external requests
  const expectedApiKey = process.env.API_KEY;
  return apiKey === expectedApiKey;
};

// Main handler function
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Skip validation for GET requests in production for now
  const isValid = req.method === 'GET' || validateApiKey(req);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }

  try {
    if (req.method === 'GET') {
      // Handle GET request - return all products
      // No API key required for read operations
      const products = await readProducts();
      res.status(200).json(products);
    } else if (req.method === 'POST') {
      // Handle POST request - add a new product
      // API key required for write operations
      
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
  } catch (error) {
    console.error("GET /api/products error:", error);
    res.status(500).json({ message: 'Error fetching products' });
  }
} 