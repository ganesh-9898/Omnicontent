/**
 * aiService.js
 * Core AI orchestration layer for OmniContent.
 * Priority: Gemini → OpenAI → Smart Mock Fallback
 */

// ─── Provider Detection ───────────────────────────────────────────────────────

function detectProvider() {
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return 'mock';
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildPrompt(rawText) {
  return `You are a professional content strategist and social media expert.

Given the following long-form content, generate repurposed content for multiple channels.

CONTENT:
"""
${rawText.slice(0, 4000)}
"""

Respond ONLY with a valid JSON object (no markdown, no code fences, no explanation) matching this EXACT schema:

{
  "twitterThread": [
    "Tweet 1 text with #hashtags (max 280 chars)",
    "Tweet 2 text with #hashtags (max 280 chars)",
    "Tweet 3 text with #hashtags (max 280 chars)",
    "Tweet 4 text with #hashtags (max 280 chars)",
    "Tweet 5 text with #hashtags (max 280 chars)"
  ],
  "linkedinPost": "Professional LinkedIn post with line breaks, bullet points (use • character), and a call to action. 150-300 words.",
  "videoScript": {
    "hook": "Attention-grabbing opening line (1-2 sentences, under 15 seconds)",
    "body": "Main content broken into 3-4 key points. Each point on a new line starting with a number and period.",
    "cta": "Clear call-to-action for viewers (1-2 sentences)"
  },
  "seoMetadata": {
    "metaTitle": "SEO-optimized page title (50-60 characters)",
    "metaDescription": "Compelling meta description (150-160 characters)",
    "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"]
  }
}`;
}

// ─── Gemini API Call ──────────────────────────────────────────────────────────

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Gemini returned empty content');

  return parseJsonResponse(rawText);
}

// ─── OpenAI API Call ──────────────────────────────────────────────────────────

async function callOpenAI(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional content strategist. Always respond with valid JSON only — no markdown, no code fences.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;
  if (!rawText) throw new Error('OpenAI returned empty content');

  return parseJsonResponse(rawText);
}

// ─── JSON Response Parser ─────────────────────────────────────────────────────

function parseJsonResponse(text) {
  // Strip any accidental markdown fences the model may add
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  return JSON.parse(cleaned);
}

// ─── Smart Mock Data Generator ────────────────────────────────────────────────

function generateMockData(rawText) {
  // Extract meaningful fragments from the input so mock feels relevant
  const sentences = rawText
    .replace(/\s+/g, ' ')
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const words = rawText.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const wordFreq = {};
  words.forEach((w) => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
  const topWords = Object.entries(wordFreq)
    .filter(([w]) => !STOP_WORDS.has(w))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([w]) => w);

  const firstSentence = sentences[0] || rawText.slice(0, 100);
  const secondSentence = sentences[1] || rawText.slice(100, 200);
  const thirdSentence = sentences[2] || rawText.slice(200, 300);
  const wordCount = rawText.split(/\s+/).length;
  const topTag1 = topWords[0] || 'content';
  const topTag2 = topWords[1] || 'strategy';
  const topTag3 = topWords[2] || 'digital';
  const topTag4 = topWords[3] || 'marketing';

  return {
    twitterThread: [
      `🧵 ${firstSentence.slice(0, 220)} #${capitalize(topTag1)} #ContentStrategy`,
      `💡 ${secondSentence.slice(0, 220)} #${capitalize(topTag2)} #DigitalMedia`,
      `📊 This ${wordCount}-word deep-dive covers everything you need to know about ${topTag1} and ${topTag2}. Here's what stood out 👇 #${capitalize(topTag3)}`,
      `🎯 Key takeaway: "${thirdSentence.slice(0, 180)}" — this changes everything about how we approach ${topTag4}. #${capitalize(topTag4)} #Insights`,
      `✅ If you found this valuable, share it with someone who needs to hear this about ${topTag1}. Follow for more threads like this 🔁 #${capitalize(topTag1)} #Thread`,
    ],
    linkedinPost: `🚀 ${firstSentence}\n\nAfter analyzing this content, here are the key insights every professional needs to know:\n\n• ${secondSentence}\n• The importance of ${topTag1} in today's landscape cannot be overstated\n• ${topTag2} and ${topTag3} are reshaping how we think about ${topTag4}\n• Data-driven approaches consistently outperform intuition alone\n• Building sustainable systems matters more than short-term wins\n\n${thirdSentence}\n\nThe bottom line? Organizations that embrace ${topTag1} and invest in ${topTag2} will define the next era of their industry.\n\nWhat's your take on this? Drop your thoughts in the comments 👇\n\n#${capitalize(topTag1)} #${capitalize(topTag2)} #${capitalize(topTag3)} #ProfessionalDevelopment #Innovation`,
    videoScript: {
      hook: `Wait — did you know that ${firstSentence.slice(0, 150)}? If not, the next 60 seconds will change how you think about ${topTag1} forever.`,
      body: `1. Let's start with the foundation: ${secondSentence.slice(0, 200)}\n2. Here's where most people get it wrong — they focus on ${topTag2} without understanding ${topTag3}\n3. The data is clear: ${topTag1} drives measurable results when you apply it consistently\n4. Real-world example: ${thirdSentence.slice(0, 200)}`,
      cta: `If this helped you, like and subscribe so you never miss content like this. And drop a comment — I want to know: are you already using ${topTag1} in your workflow?`,
    },
    seoMetadata: {
      metaTitle: `${capitalize(topTag1)} & ${capitalize(topTag2)}: Complete ${new Date().getFullYear()} Guide`,
      metaDescription: `${firstSentence.slice(0, 140).trim()}. Discover actionable strategies for ${topTag3} and ${topTag4}.`,
      tags: topWords.slice(0, 8).map(capitalize).concat(
        ['Content Strategy', 'Digital Marketing', 'AI Content', 'SEO'].slice(0, Math.max(0, 8 - topWords.slice(0, 8).length))
      ).slice(0, 8),
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const STOP_WORDS = new Set([
  'that', 'this', 'with', 'from', 'they', 'have', 'been', 'were',
  'will', 'would', 'could', 'should', 'their', 'there', 'about',
  'when', 'what', 'which', 'than', 'into', 'your', 'more', 'also',
  'some', 'time', 'just', 'like', 'very', 'only', 'over', 'such',
  'each', 'most', 'both', 'even', 'many', 'then', 'well', 'need',
  'make', 'take', 'know', 'come', 'these', 'those', 'much', 'while',
]);

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * generateContent
 * @param {string} rawText - The long-form input content
 * @param {string[]} platforms - Array of requested platform keys
 * @returns {Promise<object>} - Structured content assets
 */
export async function generateContent(rawText, platforms) {
  const provider = detectProvider();
  console.log(`[aiService] Using provider: ${provider}`);

  let result;

  if (provider === 'gemini') {
    const prompt = buildPrompt(rawText);
    result = await callGemini(prompt);
  } else if (provider === 'openai') {
    const prompt = buildPrompt(rawText);
    result = await callOpenAI(prompt);
  } else {
    console.log('[aiService] No API key found — using smart mock data generator');
    result = generateMockData(rawText);
  }

  // Validate and normalize the result structure
  return normalizeResult(result);
}

function normalizeResult(result) {
  return {
    twitterThread: Array.isArray(result.twitterThread)
      ? result.twitterThread.slice(0, 5)
      : ['Could not generate Twitter thread. Please try again.'],
    linkedinPost: typeof result.linkedinPost === 'string'
      ? result.linkedinPost
      : 'Could not generate LinkedIn post. Please try again.',
    videoScript: result.videoScript && typeof result.videoScript === 'object'
      ? {
          hook: result.videoScript.hook || '',
          body: result.videoScript.body || '',
          cta: result.videoScript.cta || '',
        }
      : { hook: '', body: '', cta: '' },
    seoMetadata: result.seoMetadata && typeof result.seoMetadata === 'object'
      ? {
          metaTitle: result.seoMetadata.metaTitle || '',
          metaDescription: result.seoMetadata.metaDescription || '',
          tags: Array.isArray(result.seoMetadata.tags) ? result.seoMetadata.tags : [],
        }
      : { metaTitle: '', metaDescription: '', tags: [] },
  };
}
