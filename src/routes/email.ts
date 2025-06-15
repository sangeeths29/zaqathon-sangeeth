import { Router, Request, Response } from 'express';
import { parseEmail } from '../services/emailParser';
import { validateOrder } from '../services/orderValidator';

const router = Router();

router.post('/process', async (req: Request, res: Response) => {
  try {
    const { emailContent } = req.body;
    
    if (!emailContent) {
      return res.status(400).json({ error: 'Email content is required' });
    }

    // Parse email content
    const parsedOrder = await parseEmail(emailContent);
    
    // Validate order against catalog
    const validationResult = await validateOrder(parsedOrder);

    return res.json({
      success: true,
      data: validationResult
    });
  } catch (error) {
    console.error('Error processing email:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process email'
    });
  }
});

// POST /api/email/parse - Accepts raw email content and returns parsed+validated order
router.post('/parse', async (req: Request, res: Response) => {
  try {
    const { emailContent } = req.body;
    if (!emailContent) {
      return res.status(400).json({ error: 'Email content is required' });
    }
    const parsedOrder = await parseEmail(emailContent);
    const validationResult = await validateOrder(parsedOrder);
    return res.json({ success: true, data: validationResult });
  } catch (error) {
    console.error('Error processing email:', error);
    return res.status(500).json({ success: false, error: 'Failed to process email' });
  }
});

export const emailRouter = router; 