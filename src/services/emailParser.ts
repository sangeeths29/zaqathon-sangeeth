import { simpleParser } from 'mailparser';
import { Order, OrderItem } from './orderValidator';

interface ParsedEmail {
  subject: string;
  text: string;
  html: string;
}

export async function parseEmail(emailContent: string): Promise<Order> {
  try {
    const parsed = await simpleParser(emailContent);
    const text = parsed.text || '';
    
    const items: OrderItem[] = [];
    // Pattern: "X x Product MODEL NUMBER" or similar
    const linePattern = /([\d]+)\s*x\s*([A-Za-z]+)\s+([A-ZÅÄÖa-zåäö]+)\s*(\d+)/gi;
    let match;
    while ((match = linePattern.exec(text)) !== null) {
      const quantity = parseInt(match[1], 10);
      const productType = match[2];
      const model = match[3];
      const number = match[4];
      const normalizedProductName = `${productType} ${model} ${number}`.replace(/\s+/g, ' ').trim();
      items.push({
        sku: normalizedProductName,
        quantity,
        notes: `Product Type: ${productType}`
      });
    }
    // Fallback: Try to match lines like "Product MODEL NUMBER – need X pcs" and others
    const fallbackPatterns = [
      /([A-Za-z]+)\s+([A-ZÅÄÖa-zåäö]+)\s+(\d+)\s*–\s*need\s+(\d+)\s+pcs/gi,
      /([A-Za-z]+)\s+([A-ZÅÄÖa-zåäö]+)\s+(\d+)\s*–\s*Qty:\s*(\d+)/gi,
      /(\d+)\s+units\s+of\s+([A-Za-z]+)\s+([A-ZÅÄÖa-zåäö]+)\s+(\d+)/gi,
      /(\d+)\s+pieces:\s+([A-Za-z]+)\s+([A-ZÅÄÖa-zåäö]+)\s+(\d+)/gi
    ];
    for (const pattern of fallbackPatterns) {
      while ((match = pattern.exec(text)) !== null) {
        let quantity, productType, model, number;
        if (pattern === fallbackPatterns[0] || pattern === fallbackPatterns[1]) {
          productType = match[1];
          model = match[2];
          number = match[3];
          quantity = parseInt(match[4], 10);
        } else {
          quantity = parseInt(match[1], 10);
          productType = match[2];
          model = match[3];
          number = match[4];
        }
        const normalizedProductName = `${productType} ${model} ${number}`.replace(/\s+/g, ' ').trim();
        items.push({
          sku: normalizedProductName,
          quantity,
          notes: `Product Type: ${productType}`
        });
      }
    }
    // Extract delivery information
    const deliveryPattern = /(?:Ship|Send|Deliver|Do deliver) to:?[ \t]*([^\n]+)/i;
    const deliveryMatch = text.match(deliveryPattern);
    // Extract deadline
    const deadlinePattern = /(?:Deadline|Before|Requested delivery date):[ \t]*([^\n]+)/i;
    const deadlineMatch = text.match(deadlinePattern);
    // Extract customer notes
    const notesPattern = /(?:Let me know|If there are better alternatives|Please ensure)([^.]*)/i;
    const notesMatch = text.match(notesPattern);
    return {
      items,
      deliveryPreference: deliveryMatch ? deliveryMatch[1].trim() : undefined,
      customerNotes: notesMatch ? notesMatch[1].trim() : undefined,
      deadline: deadlineMatch ? deadlineMatch[1].trim() : undefined
    };
  } catch (error) {
    console.error('Error parsing email:', error);
    throw new Error('Failed to parse email content');
  }
} 