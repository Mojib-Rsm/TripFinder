'use server';
/**
 * @fileoverview A flow that provides personalized hotel recommendations.
 */
import { ai } from '@/ai/genkit';
import { hotelRecommendationTool } from './hotel-recommendation-tool';
import {
  PersonalizedHotelRecommendationsInputSchema,
  PersonalizedHotelRecommendationsOutputSchema,
  type PersonalizedHotelRecommendationsInput,
  type PersonalizedHotelRecommendationsOutput
} from './personalized-hotel-recommendations-types';


const personalizedHotelRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedHotelRecommendationsFlow',
    inputSchema: PersonalizedHotelRecommendationsInputSchema,
    outputSchema: PersonalizedHotelRecommendationsOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: `You are a travel agent who is an expert at recommending hotels. A user is looking for a hotel in ${input.location} and has the following preferences: "${input.preferences}". Use the hotel recommendation tool to find available hotels and then provide a personalized recommendation of up to 3 hotels that best match their preferences. Explain why you are recommending these hotels.`,
      tools: [hotelRecommendationTool],
      model: 'googleai/gemini-2.5-flash',
    });

    const toolChoice = llmResponse.choices[0].message.toolCalls?.[0];
    if (!toolChoice) {
      throw new Error('Expected the model to choose the hotel recommendation tool.');
    }

    const toolResponse = await hotelRecommendationTool(toolChoice.args as any);

    const finalLlmResponse = await ai.generate({
      prompt: `You are a travel agent who is an expert at recommending hotels. A user is looking for a hotel in ${input.location} and has the following preferences: "${input.preferences}". You have the following hotel options available: ${JSON.stringify(toolResponse.output)}. Provide a personalized recommendation of up to 3 hotels that best match their preferences. Explain why you are recommending these hotels.`,
      model: 'googleai/gemini-2.5-flash',
      output: {
        schema: PersonalizedHotelRecommendationsOutputSchema,
      },
    });

    return finalLlmResponse.output()!;
  }
);


export async function getPersonalizedHotelRecommendations(
  input: PersonalizedHotelRecommendationsInput
): Promise<PersonalizedHotelRecommendationsOutput> {
  return await personalizedHotelRecommendationsFlow(input);
}
