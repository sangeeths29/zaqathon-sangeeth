import { parseEmail } from '../services/emailParser';
import fs from 'fs/promises';
import path from 'path';

describe('Email Parser', () => {
  const sampleEmails = [
    'sample_email_1.txt',
    'sample_email_2.txt',
    'sample_email_3.txt',
    'sample_email_4.txt',
    'sample_email_5.txt'
  ];

  test.each(sampleEmails)('should parse %s correctly', async (filename) => {
    const emailPath = path.join(__dirname, '../../data', filename);
    const emailContent = await fs.readFile(emailPath, 'utf-8');
    const result = await parseEmail(emailContent);

    // Basic validation
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items.length).toBeGreaterThan(0);

    // Validate each item
    result.items.forEach(item => {
      expect(item.sku).toMatch(/^[A-ZÅÄÖ]+-\d+$/);
      expect(item.quantity).toBeGreaterThan(0);
    });

    // Validate delivery information
    expect(result.deliveryPreference).toBeDefined();
    expect(typeof result.deliveryPreference).toBe('string');

    // Validate deadline if present
    if (result.deadline) {
      expect(typeof result.deadline).toBe('string');
    }
  });
}); 