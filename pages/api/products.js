import { Redis } from '@upstash/redis';
import fs from 'fs/promises'; // Import Node.js file system module
import path from 'path'; // Import Node.js path module

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

// Path to the products JSON file
const productsFilePath = path.join(process.cwd(), 'data', 'products.json');

// Helper function to read products from Redis - EXPORTED
export const readProducts = async () => {
  if (!redis) {
    console.error('Redis client not initialized');
    throw new Error('Database connection not available');
  }
  try {
    // --- TEMPORARY CODE REMOVED ---
    // console.log('Attempting to delete existing products key...');
    // await redis.del('products'); 
    // console.log('Deleted products key (if it existed).');
    // --- END TEMPORARY CODE ---
    
    // Use redis.get to retrieve the JSON string
    let productsJson = await redis.get('products');
    
    // If productsJson is null or empty, seed from file
    if (!productsJson) {
      console.log('Redis is empty. Seeding products from products.json...');
      try {
        const fileData = await fs.readFile(productsFilePath, 'utf-8');
        const initialProducts = JSON.parse(fileData);
        
        // Write the initial products to Redis
        await writeProducts(initialProducts); 
        console.log('Successfully seeded Redis with products.');
        return initialProducts; // Return the newly seeded data
      } catch (seedError) {
        console.error('Error seeding products from file:', seedError);
        // If seeding fails, return empty array or throw specific error
        return []; 
      }
    }
    
    // Parse the JSON string into an array if data exists in Redis
    return JSON.parse(productsJson);
  } catch (error) {
    // Handle potential JSON parsing errors
    if (error instanceof SyntaxError) {
      console.error('Error parsing products JSON from Redis:', error);
      // Consider returning empty or attempting recovery/deletion of bad key
      return []; 
    }
    console.error('Error reading from Redis:', error);
    throw new Error('Failed to fetch products from database');
  }
};

// Helper function to write products to Redis
const writeProducts = async (productsArray) => {
  if (!redis) {
    console.error('Redis client not initialized');
    throw new Error('Database connection not available');
  }
  try {
    // Store products in Redis as a JSON string
    await redis.set('products', JSON.stringify(productsArray));
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