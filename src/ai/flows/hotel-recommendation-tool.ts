// This is a server-side file.
'use server';

/**
 * @fileOverview Analyzes hotel ratings and reviews to provide the top three hotel recommendations.
 *
 * - hotelRecommendationTool - A function that recommends hotels based on reviews and ratings.
 * - HotelRecommendationInput - The input type for the hotelRecommendationTool function.
 * - HotelRecommendationOutput - The return type for the hotelRecommendationTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HotelRecommendationInputSchema = z.object({
  hotelDetails: z.array(
    z.object({
      name: z.string().describe('The name of the hotel.'),
      rating: z.number().describe('The rating of the hotel (e.g., 4.5).'),
      reviews: z.array(z.string()).describe('An array of reviews for the hotel.'),
      location: z.string().describe('The location of the hotel.'),
      price: z.number().describe('The price of the hotel per night'),
    })
  ).describe('An array of hotel details, including name, rating, reviews, location and price.'),
  searchCriteria: z.string().describe('The user\u2019s search criteria, such as \"hotels near the beach with free breakfast\"'),
});

export type HotelRecommendationInput = z.infer<typeof HotelRecommendationInputSchema>;

const HotelRecommendationOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      name: z.string().describe('The name of the recommended hotel.'),
      reason: z.string().describe('The reason why this hotel is recommended.'),
    })
  ).describe('An array of hotel recommendations with reasons.'),
});

export type HotelRecommendationOutput = z.infer<typeof HotelRecommendationOutputSchema>;

export async function hotelRecommendationTool(input: HotelRecommendationInput): Promise<HotelRecommendationOutput> {
  return hotelRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'hotelRecommendationPrompt',
  input: {schema: HotelRecommendationInputSchema},
  output: {schema: HotelRecommendationOutputSchema},
  prompt: `You are an AI travel assistant. Given a list of hotels with their ratings, reviews, location and price, and a user's search criteria, you must select the top three hotels that best match the user's needs.

Consider the user's search criteria: {{{searchCriteria}}}.

Here are the hotels:
{{#each hotelDetails}}
  - Name: {{this.name}}
    Rating: {{this.rating}}
    Reviews: {{this.reviews}}
    Location: {{this.location}}
    Price: {{this.price}}
{{/each}}

Provide the top three hotel recommendations, with a reason for each recommendation. Be concise.

Output in the following JSON format:
`,
});

const hotelRecommendationFlow = ai.defineFlow(
  {
    name: 'hotelRecommendationFlow',
    inputSchema: HotelRecommendationInputSchema,
    outputSchema: HotelRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
