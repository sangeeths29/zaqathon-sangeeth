import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
const { parse } = require('csv-parse/sync');

// Define the catalog item schema
const CatalogItemSchema = z.object({
  productCode: z.string(),
  productName: z.string(),
  price: z.number(),
  availableInStock: z.number(),
  minOrderQuantity: z.number(),
  description: z.string(),
});

export type CatalogItem = z.infer<typeof CatalogItemSchema>;

let catalogCache: CatalogItem[] | null = null;

export async function loadCatalog(): Promise<CatalogItem[]> {
  if (catalogCache) {
    return catalogCache;
  }

  try {
    const catalogPath = path.join(__dirname, '../../data/Product Catalog.csv');
    const fileContent = await fs.readFile(catalogPath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Normalize and validate
    const items = records.map((row: any) => CatalogItemSchema.parse({
      productCode: row.Product_Code,
      productName: row.Product_Name,
      price: parseFloat(row.Price),
      availableInStock: parseInt(row.Available_in_Stock, 10),
      minOrderQuantity: parseInt(row.Min_Order_Quantity, 10),
      description: row.Description,
    }));
    catalogCache = items;
    return items;
  } catch (error) {
    console.error('Error loading catalog:', error);
    throw new Error('Failed to load product catalog');
  }
}

export async function getCatalogItemByCode(productCode: string): Promise<CatalogItem | null> {
  const catalog = await loadCatalog();
  return catalog.find(item => item.productCode === productCode) || null;
}

export async function getCatalogItemByName(productName: string): Promise<CatalogItem | null> {
  const catalog = await loadCatalog();
  return catalog.find(item => item.productName.toLowerCase() === productName.toLowerCase()) || null;
}

export async function searchCatalog(query: string): Promise<CatalogItem[]> {
  const catalog = await loadCatalog();
  const searchTerm = query.toLowerCase();
  return catalog.filter(item =>
    item.productCode.toLowerCase().includes(searchTerm) ||
    item.productName.toLowerCase().includes(searchTerm) ||
    item.description.toLowerCase().includes(searchTerm)
  );
} 