// src/ai/flows/personalized-hotel-recommendations.ts
'use server';

/**
 * @fileOverview Personalized hotel recommendations based on user search history and preferences.
 *
 * This file exports:
 *   - personalizedHotelRecommendations - A function that takes user search history and hotel details to provide personalized recommendations.
 *   - PersonalizedHotelRecommendationsInput - The input type for the personalizedHotelRecommendations function.
 *   - PersonalizedHotelRecommendationsOutput - The output type for the personalizedHotelRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HotelDetailsSchema = z.object({
  hotelName: z.string().describe('The name of the hotel.'),
  hotelDescription: z.string().describe('A detailed description of the hotel.'),
  rating: z.number().describe('The average rating of the hotel.'),
  review: z.string().describe('User review of the hotel'),
});

const UserSearchHistorySchema = z.object({
  location: z.string().describe('The location the user searched for.'),
  dates: z.string().describe('The dates the user searched for.'),
  preferences: z.string().describe('The user preferences for hotels (e.g., price range, amenities).'),
});

const PersonalizedHotelRecommendationsInputSchema = z.object({
  userHistory: z.array(UserSearchHistorySchema).describe('The user search history.'),
  hotelDetails: z.array(HotelDetailsSchema).describe('A list of Hotel details.'),
});
export type PersonalizedHotelRecommendationsInput = z.infer<
  typeof PersonalizedHotelRecommendationsInputSchema
>;

const RecommendationSchema = z.object({
  hotelName: z.string().describe('The name of the recommended hotel.'),
  reason: z.string().describe('The reason for recommending this hotel based on user history.'),
});

const PersonalizedHotelRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).describe('A list of personalized hotel recommendations.'),
});

export type PersonalizedHotelRecommendationsOutput = z.infer<
  typeof PersonalizedHotelRecommendationsOutputSchema
>;

export async function personalizedHotelRecommendations(
  input: PersonalizedHotelRecommendationsInput
): Promise<PersonalizedHotelRecommendationsOutput> {
  return personalizedHotelRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedHotelRecommendationsPrompt',
  input: {
    schema: PersonalizedHotelRecommendationsInputSchema,
  },
  output: {
    schema: PersonalizedHotelRecommendationsOutputSchema,
  },
  prompt: `Based on the user's past search history and preferences, recommend the top 3 hotels from the following list of hotels. Explain the reason for each recommendation based on how well it aligns with the user's past behavior and stated preferences.

User Search History:
{{#each userHistory}}
- Location: {{this.location}}, Dates: {{this.dates}}, Preferences: {{this.preferences}}
{{/each}}

Hotel Details:
{{#each hotelDetails}}
- Hotel Name: {{this.hotelName}}, Description: {{this.hotelDescription}}, Rating: {{this.rating}}, Review: {{this.review}}
{{/each}}

Give the top 3 hotel recommendations in JSON format.
Ensure that the hotelName matches exactly to the list of Hotel Details and the reason describes clearly how it matches the user's history and preferences.
Here is the output schema: {{{outputSchema}}}
`, 
});

const personalizedHotelRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedHotelRecommendationsFlow',
    inputSchema: PersonalizedHotelRecommendationsInputSchema,
    outputSchema: PersonalizedHotelRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
