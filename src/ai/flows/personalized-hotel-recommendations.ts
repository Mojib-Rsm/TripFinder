
'use server';
/**
 * @fileoverview A flow that provides personalized hotel recommendations.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { hotelRecommendationTool } from './hotel-recommendation-tool';

export const PersonalizedHotelRecommendationsInputSchema = z.object({
  location: z.string().describe('The destination city for the hotel search.'),
  preferences: z.string().describe('A description of the user\'s preferences for the hotel, such as "traveling with family," "looking for a budget-friendly option," or "wants a luxurious experience."'),
});
export type PersonalizedHotelRecommendationsInput = z.infer<typeof PersonalizedHotelRecommendationsInputSchema>;

export const PersonalizedHotelRecommendationsOutputSchema = z.object({
  reasoning: z.string().describe('An explanation of why the recommended hotels were chosen, tailored to the user\'s preferences.'),
  hotels: z.array(z.object({
    name: z.string().describe('The name of the recommended hotel.'),
    price: z.number().describe('The price per night for the hotel.'),
    rating: z.number().describe('The hotel\'s rating out of 5.'),
  })).describe('A list of up to 3 recommended hotels.'),
});
export type PersonalizedHotelRecommendationsOutput = z.infer<typeof PersonalizedHotelRecommendationsOutputSchema>;

export const personalizedHotelRecommendationsFlow = ai.defineFlow(
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
