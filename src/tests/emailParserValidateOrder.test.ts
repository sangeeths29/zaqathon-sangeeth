import { parseEmail } from '../services/emailParser';
import { validateOrder } from '../services/orderValidator';
import fs from 'fs/promises';
import path from 'path';

describe('Email Parser + Order Validation Integration', () => {
  const sampleEmails = [
    'sample_email_1.txt',
    'sample_email_2.txt',
    'sample_email_3.txt',
    'sample_email_4.txt',
    'sample_email_5.txt'
  ];

  test.each(sampleEmails)('should parse and validate %s', async (filename) => {
    const emailPath = path.join(__dirname, '../../data', filename);
    const emailContent = await fs.readFile(emailPath, 'utf-8');
    const parsedOrder = await parseEmail(emailContent);
    const validation = await validateOrder(parsedOrder);
    // Print output for review
    console.log(`\n--- ${filename} ---`);
    console.dir(validation, { depth: null });
    expect(validation).toBeDefined();
    expect(Array.isArray(validation.validatedItems)).toBe(true);
    expect(validation.validatedItems.length).toBeGreaterThan(0);
  });
}); 