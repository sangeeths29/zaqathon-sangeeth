import { z } from 'zod';
import { getCatalogItemByCode, getCatalogItemByName, searchCatalog, CatalogItem, loadCatalog } from './catalog';

// Define the order item schema
const OrderItemSchema = z.object({
  sku: z.string(),
  quantity: z.number().positive(),
  notes: z.string().optional(),
});

// Define the order schema
const OrderSchema = z.object({
  items: z.array(OrderItemSchema),
  deliveryPreference: z.string().optional(),
  customerNotes: z.string().optional(),
  deadline: z.string().optional(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;

export interface ValidationResult {
  isValid: boolean;
  order: Order;
  issues: ValidationIssue[];
  suggestions: Suggestion[];
  validatedItems: ValidatedOrderItem[];
}

export interface ValidationIssue {
  type: 'PRODUCT_NOT_FOUND' | 'INSUFFICIENT_QUANTITY' | 'INSUFFICIENT_STOCK';
  message: string;
  item: OrderItem;
}

export interface Suggestion {
  type: 'ALTERNATIVE_PRODUCT' | 'COMBINE_ORDERS';
  message: string;
  originalItem: OrderItem;
  suggestedItem?: CatalogItem;
}

export interface ValidatedOrderItem extends OrderItem {
  productCode?: string;
  productName?: string;
  price?: number;
  availableInStock?: number;
  minOrderQuantity?: number;
  description?: string;
}

export async function validateOrder(order: Order): Promise<ValidationResult> {
  const issues: ValidationIssue[] = [];
  const suggestions: Suggestion[] = [];
  const validatedItems: ValidatedOrderItem[] = [];
  const catalog = await loadCatalog();

  for (const item of order.items) {
    // Try to match by normalized product name (Product_Name)
    let catalogItem = catalog.find(
      c => c.productName.toLowerCase() === item.sku.toLowerCase()
    );
    // Fallback: try by code
    if (!catalogItem) {
      const byCode = await getCatalogItemByCode(item.sku);
      catalogItem = byCode || undefined;
    }
    // Fallback: try by name (case-insensitive)
    if (!catalogItem) {
      const byName = await getCatalogItemByName(item.sku);
      catalogItem = byName || undefined;
    }
    if (!catalogItem) {
      // Try fuzzy search for alternatives
      const alternatives = await searchCatalog(item.sku);
      suggestions.push({
        type: 'ALTERNATIVE_PRODUCT',
        message: `No exact match for "${item.sku}". Did you mean: ${alternatives.map(a => a.productName).slice(0, 3).join(', ')}?`,
        originalItem: item,
        suggestedItem: alternatives[0],
      });
      issues.push({
        type: 'PRODUCT_NOT_FOUND',
        message: `Product "${item.sku}" not found in catalog`,
        item,
      });
      validatedItems.push({ ...item });
      continue;
    }

    // Check MOQ
    if (item.quantity < catalogItem.minOrderQuantity) {
      issues.push({
        type: 'INSUFFICIENT_QUANTITY',
        message: `Quantity ${item.quantity} is below minimum order quantity of ${catalogItem.minOrderQuantity}`,
        item,
      });
      // Suggest combining orders if close to MOQ
      if (catalogItem.minOrderQuantity - item.quantity <= 10) {
        suggestions.push({
          type: 'COMBINE_ORDERS',
          message: `Consider combining orders to meet MOQ of ${catalogItem.minOrderQuantity}`,
          originalItem: item,
        });
      }
    }

    // Check stock
    if (item.quantity > catalogItem.availableInStock) {
      issues.push({
        type: 'INSUFFICIENT_STOCK',
        message: `Requested quantity ${item.quantity} exceeds available stock of ${catalogItem.availableInStock}`,
        item,
      });
    }

    validatedItems.push({
      ...item,
      productCode: catalogItem.productCode,
      productName: catalogItem.productName,
      price: catalogItem.price,
      availableInStock: catalogItem.availableInStock,
      minOrderQuantity: catalogItem.minOrderQuantity,
      description: catalogItem.description,
    });
  }

  return {
    isValid: issues.length === 0,
    order,
    issues,
    suggestions,
    validatedItems,
  };
} 