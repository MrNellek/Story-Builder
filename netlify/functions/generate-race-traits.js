const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { race, storyContext } = JSON.parse(event.body);

    if (!race) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Race parameter is required' }),
      };
    }

    const prompt = `Generate detailed fantasy race traits for a "${race}" race in a story. Include physical characteristics, cultural tendencies, personality traits, abilities, and any unique features. Keep it concise but comprehensive.

${storyContext ? `Story context: ${storyContext}` : ''}

Format the response as a JSON object with these keys:
- physical: array of physical traits
- cultural: array of cultural tendencies
- personality: array of personality traits
- abilities: array of special abilities
- features: array of unique features`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0].text;

    // Try to parse the response as JSON
    let traits;
    try {
      traits = JSON.parse(content);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      traits = {
        physical: [],
        cultural: [],
        personality: [],
        abilities: [],
        features: [],
        rawResponse: content
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify(traits),
    };
  } catch (error) {
    console.error('Error generating race traits:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate race traits' }),
    };
  }
};