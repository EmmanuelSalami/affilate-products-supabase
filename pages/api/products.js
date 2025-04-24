// FILE: pages/api/products.js (now using Supabase instead of Redis)

import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Supabase setup (environment variables)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Path to the fallback products.json file
const productsFilePath = path.join(process.cwd(), 'data', 'products.json');

// [UPDATED] Read products from Supabase, fallback to local file if error
export const readProducts = async () => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    console.log('✅ Loaded products from Supabase');
    return data;
  } catch (err) {
    console.warn('⚠️ Supabase read failed, using local JSON:', err.message);
    try {
      const raw = await fs.readFile(productsFilePath, 'utf-8');
      const localProducts = JSON.parse(raw);
      return localProducts;
    } catch (fileError) {
      console.error('❌ Failed to read products.json:', fileError.message);
      return [];
    }
  }
};

// [UPDATED] Write a new product to Supabase
const writeProducts = async (productsArray) => {
  // NOT used in Supabase version — we insert per product
  console.log('ℹ️ writeProducts() not used with Supabase');
};

const getProductById = async (productId) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', productId).single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error fetching product by ID:', err.message);
    return null;
  }
};

const searchProductsByTitle = async (searchTerm) => {
  try {
    const { data, error } = await supabase.from('products')
      .select('*')
      .ilike('title', `%${searchTerm}%`);
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Search failed:', err.message);
    return [];
  }
};

const deleteProductsByIds = async (idsToDelete) => {
  try {
    const { data, error } = await supabase.from('products')
      .delete()
      .in('id', idsToDelete)
      .select(); // Added select to always return the deleted objects
    if (error) throw error;
    if (data.length == 0) { // If no data was returned, then no products where deleted.
       return {
        deletedCount: 0,
        deletedIds: [],
        remainingCount: 'unknown (query again if needed)',
      };
    }
    return {
      deletedCount: data.length,
      deletedIds: data.map((p) => p.id),
      remainingCount: 'unknown (query again if needed)',
    };
  } catch (error) {
    console.error('Supabase delete error:', error.message);
    throw new Error('Failed to delete products');
  }
};


const validateApiKey = (req) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key || (req.body && req.body.api_key);
  if (process.env.NODE_ENV === 'development') return true;
  const referer = req.headers.referer || '';
  const host = req.headers.host || '';
  if (referer && referer.includes(host)) return true;
  const expectedApiKey = process.env.API_KEY;
  return apiKey === expectedApiKey;
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const isValid = req.method === 'GET' || validateApiKey(req);
  if (!isValid) return res.status(401).json({ error: 'Invalid or missing API key' });

  try {
    if (req.method === 'GET') {
      const { id, title } = req.query;
      if (id) {
        const product = await getProductById(id);
        if (product) return res.status(200).json(product);
        else return res.status(404).json({ message: `Product with ID ${id} not found` });
      } else if (title) {
        const filteredProducts = await searchProductsByTitle(title);
        return res.status(200).json(filteredProducts);
      } else {
        const products = await readProducts();
        return res.status(200).json(products);
      }
    } else if (req.method === 'POST') {
      try {
        const { title, imageUrl, description, productUrl } = req.body;
        if (!title || !productUrl) {
          return res.status(400).json({ message: 'Missing required fields: title and productUrl are required' });
        }
        const newProduct = {
          id: crypto.randomUUID(),
          title,
          imageUrl: imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
          description: description || '',
          productUrl,
        };
        const { data, error } = await supabase.from('products').insert([newProduct]).select();
        if (error) throw error;
        return res.status(201).json(data[0]);
      } catch (error) {
        console.error("POST /api/products error:", error.message);
        return res.status(500).json({ message: 'Error adding product', error: error.message });
      }
    } else if (req.method === 'DELETE') {
      try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
          return res.status(400).json({ message: 'Request body must include an "ids" array' });
        }
        const result = await deleteProductsByIds(ids);
        return res.status(200).json({ message: `Successfully deleted ${result.deletedCount} products`, ...result });
      } catch (error) {
        console.error("DELETE /api/products error:", error.message);
        return res.status(500).json({ message: 'Error deleting products', error: error.message });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("/api/products error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
