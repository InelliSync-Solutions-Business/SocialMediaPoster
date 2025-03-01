/**
 * Template strings for image generation prompts
 */

// Base template for all image prompts
export const IMAGE_BASE_TEMPLATE = `
Create a detailed, descriptive prompt for generating an image related to {{topic}} that will resonate with {{targetAudience}}.

IMAGE PARAMETERS:
- Subject: {{topic}}
- Style: {{style}}
- Mood/Atmosphere: {{mood}}
- Aspect Ratio: {{aspectRatio}}
{{visualElements}}

PROMPT STRUCTURE:
1. Main Subject Description - Detailed description of the primary subject
2. Setting/Background - Description of the environment or context
3. Style/Aesthetic - Specific art style, technique, or visual approach
4. Lighting/Color/Mood - Emotional tone and visual atmosphere
5. Composition Details - How elements are arranged in the frame
6. Technical Specifications - Any specific rendering details (photorealistic, 3D, etc.)

AVOID:
- Copyrighted characters or specific people
- Text elements that need to be readable
- Multiple frames or sequential scenes
- Overly complex compositions with too many elements
- Explicit content or inappropriate imagery

The output should be a single, coherent, detailed image description that can be directly used with AI image generation tools.
`;

// Style options for image generation
export const STYLE_OPTIONS = {
  realistic: 'Photorealistic with natural lighting and authentic details',
  artistic: 'Creative artistic interpretation with expressive elements',
  minimalist: 'Clean, simple composition with essential elements only',
  vibrant: 'Bold, colorful design with high contrast and energy',
  vintage: 'Retro aesthetic with period-appropriate styling and details',
  futuristic: 'Forward-looking design with advanced technology elements',
  abstract: 'Non-representational design focused on shapes, colors, and patterns',
  cartoon: 'Stylized illustration with simplified forms and bold outlines',
  cinematic: 'Movie-like composition with dramatic lighting and atmosphere',
  surreal: 'Dreamlike imagery combining unexpected elements'
};

// Mood options for image generation
export const MOOD_OPTIONS = {
  professional: 'Polished, business-appropriate atmosphere conveying expertise and reliability',
  cheerful: 'Bright, optimistic atmosphere with warm colors and positive elements',
  serene: 'Calm, peaceful atmosphere with soft colors and balanced composition',
  dramatic: 'Intense, emotional atmosphere with strong contrasts and dynamic elements',
  mysterious: 'Intriguing, enigmatic atmosphere with subtle details and deeper meaning',
  energetic: 'Dynamic, lively atmosphere with movement and vibrant elements',
  nostalgic: 'Wistful, reminiscent atmosphere evoking fond memories',
  inspirational: 'Uplifting, motivational atmosphere that conveys possibility'
};

// System prompt for image prompt generation
export const IMAGE_SYSTEM_PROMPT = `You are NOVA (Neural Optimized Virtual Assistant), an expert at creating detailed prompts for AI image generation. Your task is to craft descriptive, detailed prompts that will help AI image generation tools create compelling visuals.

Focus on creating prompts that are specific, descriptive, and provide clear guidance on style, composition, and mood. Avoid including elements that are difficult for image generation AI to render correctly.`;

export default {
  IMAGE_BASE_TEMPLATE,
  STYLE_OPTIONS,
  MOOD_OPTIONS,
  IMAGE_SYSTEM_PROMPT
};
