require('dotenv').config();
/**
 * Explanation Builder
 * Converts rule-based reasons into human-readable explanations
 * NOTE: LLM integration is OPTIONAL - AI is ONLY for text formatting, NOT decision-making
 */

const fetch = require('node-fetch');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'YOUR_OPENROUTER_API_KEY';

/**
 * Build natural language explanation from reasons
 * @param {Object} scoreData - {finalScore, reasons, warnings, systemScores}
 * @param {String} itemName - Food or recipe name
 * @returns {String} - Human-readable explanation
 */
const buildExplanation = (scoreData, itemName) => {
  const { finalScore, reasons, warnings, systemScores } = scoreData;

  let explanation = '';

  // Header
  if (finalScore >= 70) {
    explanation += `✅ **${itemName}** is highly recommended for you (Score: ${finalScore}/100).\n\n`;
  } else if (finalScore >= 50) {
    explanation += `✔️ **${itemName}** is suitable for you (Score: ${finalScore}/100).\n\n`;
  } else if (finalScore >= 30) {
    explanation += `⚠️ **${itemName}** is moderately suitable (Score: ${finalScore}/100).\n\n`;
  } else {
    explanation += `❌ **${itemName}** is not recommended (Score: ${finalScore}/100).\n\n`;
  }

  // System-wise breakdown
  if (systemScores) {
    explanation += '**System Analysis:**\n';
    if (systemScores.ayurveda !== 0) {
      explanation += `- Ayurveda: ${systemScores.ayurveda > 0 ? '+' : ''}${systemScores.ayurveda}\n`;
    }
    if (systemScores.unani !== 0) {
      explanation += `- Unani: ${systemScores.unani > 0 ? '+' : ''}${systemScores.unani}\n`;
    }
    if (systemScores.tcm !== 0) {
      explanation += `- TCM: ${systemScores.tcm > 0 ? '+' : ''}${systemScores.tcm}\n`;
    }
    if (systemScores.modern !== 0) {
      explanation += `- Modern Nutrition: ${systemScores.modern > 0 ? '+' : ''}${systemScores.modern}\n`;
    }
    if (systemScores.safety !== 0) {
      explanation += `- Safety: ${systemScores.safety > 0 ? '+' : ''}${systemScores.safety}\n`;
    }
    explanation += '\n';
  }

  // Positive reasons
  if (reasons && reasons.length > 0) {
    explanation += '**Why this is good for you:**\n';
    reasons.forEach(reason => {
      explanation += `- ${reason}\n`;
    });
    explanation += '\n';
  }

  // Warnings
  if (warnings && warnings.length > 0) {
    explanation += '**Considerations:**\n';
    warnings.forEach(warning => {
      explanation += `- ${warning}\n`;
    });
    explanation += '\n';
  }

  return explanation.trim();
};

/**
 * Build summary explanation for multiple recommendations
 * @param {Array} recommendations - Array of scored items
 * @param {Object} userProfile - User health profile summary
 * @returns {String} - Summary explanation
 */
const buildSummaryExplanation = (recommendations, userProfile) => {
  if (recommendations.length === 0) {
    return 'No suitable recommendations found based on your health profile.';
  }

  let summary = `Based on your health profile, we found **${recommendations.length} personalized recommendations**.\n\n`;

  // User profile summary
  if (userProfile.dominantDosha) {
    summary += `Your **dominant dosha** is ${userProfile.dominantDosha}. `;
  }

  if (userProfile.medicalConditions && userProfile.medicalConditions.length > 0) {
    summary += `We've considered your medical conditions: ${userProfile.medicalConditions.join(', ')}. `;
  }

  if (userProfile.dietaryPreferences && userProfile.dietaryPreferences.length > 0) {
    summary += `Your dietary preferences (${userProfile.dietaryPreferences.join(', ')}) have been respected. `;
  }

  summary += '\n\n';

  // Top recommendation highlight
  const topRec = recommendations[0];
  summary += `**Top Recommendation:** ${topRec.name} (Score: ${topRec.finalScore}/100)\n`;
  
  if (topRec.reasons && topRec.reasons.length > 0) {
    summary += `Key benefits: ${topRec.reasons.slice(0, 3).join(', ')}\n\n`;
  }

  // Category distribution
  const categories = [...new Set(recommendations.map(r => r.category))];
  if (categories.length > 1) {
    summary += `**Variety:** We've included foods from ${categories.length} categories: ${categories.join(', ')}\n\n`;
  }

  return summary.trim();
};

/**
 * Build simple text explanation (without markdown)
 * @param {Object} scoreData 
 * @param {String} itemName 
 * @returns {String}
 */
const buildSimpleExplanation = (scoreData, itemName) => {
  const { finalScore, reasons, warnings } = scoreData;

  let text = `${itemName} has a compatibility score of ${finalScore} out of 100 for you. `;

  if (reasons && reasons.length > 0) {
    text += `Benefits: ${reasons.join('; ')}. `;
  }

  if (warnings && warnings.length > 0) {
    text += `Considerations: ${warnings.join('; ')}.`;
  }

  return text.trim();
};

/**
 * OPTIONAL: LLM-based explanation enhancement using Gemini
 * NOTE: This is OPTIONAL and AI is ONLY for formatting, NOT for logic
 * @param {String} baseExplanation - Rule-based explanation
 * @param {Object} scoreData - Original score data for context
 * @returns {String} - Enhanced explanation (or original if LLM unavailable)
 */
const enhanceWithLLM = async (baseExplanation, scoreData = {}) => {
    console.log('[LLM DEBUG] OPENROUTER_API_KEY:', OPENROUTER_API_KEY ? OPENROUTER_API_KEY.substring(0, 10) + '...' : 'undefined');
  const prompt = `You are a friendly, knowledgeable nutritionist explaining a food recommendation to a patient.\n\nIMPORTANT RULES:\n1. Convert the technical explanation below into warm, conversational language\n2. Keep ALL facts, scores, and reasons accurate - DO NOT add new medical claims\n3. Write 2-3 friendly sentences that explain why this food is recommended\n4. Use simple language, avoid jargon\n5. Maintain the same level of recommendation (highly recommended / suitable / not recommended)\n\nTECHNICAL EXPLANATION TO CONVERT:\n${baseExplanation}\n\nYour friendly explanation (2-3 sentences):`;
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo', // Change to your desired model
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    if (data.choices && Array.isArray(data.choices) && data.choices[0] && data.choices[0].message) {
      const enhancedText = data.choices[0].message.content.trim();
      console.log('[LLM DEBUG] OpenRouter response:', enhancedText);
      if (!enhancedText) {
        console.warn('[LLM DEBUG] OpenRouter returned empty response. Using base explanation.');
        return baseExplanation;
      }
      return enhancedText;
    } else {
      console.warn('[LLM DEBUG] OpenRouter returned malformed response. Using base explanation.', data);
      return baseExplanation;
    }
  } catch (error) {
    console.warn('[LLM DEBUG] LLM enhancement failed, using base explanation:', error);
    return baseExplanation;
  }
};

module.exports = {
  buildExplanation,
  buildSummaryExplanation,
  buildSimpleExplanation,
  enhanceWithLLM
};
