import express from 'express';
import { generateContent } from '../services/aiService.js';

const router = express.Router();

/**
 * POST /api/transform
 * Body: { content: string, platforms: string[] }
 * Returns: { twitterThread, linkedinPost, videoScript, seoMetadata }
 */
router.post('/transform', async (req, res) => {
  const { content, platforms } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation failed',
      message: '`content` is required and must be a non-empty string.',
    });
  }

  if (content.trim().length < 50) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Content must be at least 50 characters long for meaningful results.',
    });
  }

  const requestedPlatforms = Array.isArray(platforms) && platforms.length > 0
    ? platforms
    : ['twitter', 'linkedin', 'videoScript', 'seoMetadata'];

  try {
    console.log(`[Transform] Processing ${content.length} chars for platforms: ${requestedPlatforms.join(', ')}`);
    const result = await generateContent(content.trim(), requestedPlatforms);
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('[Transform] Error:', err.message);
    return res.status(500).json({
      error: 'Content generation failed',
      message: err.message,
    });
  }
});

export default router;
