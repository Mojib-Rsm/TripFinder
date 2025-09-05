/**
 * @fileoverview Types and schemas for the personalized hotel recommendations flow.
 */
import { z } from 'zod';

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
