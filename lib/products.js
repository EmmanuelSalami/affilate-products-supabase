// FILE: lib/products.js
import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Fallback path
const productsFilePath = path.join(process.cwd(), 'data', 'products.json');

export const readProducts = async () => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
  } catch (err) {
    try {
      const raw = await fs.readFile(productsFilePath, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
};
