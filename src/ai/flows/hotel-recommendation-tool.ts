
'use server';
/**
 * @fileoverview A tool for finding hotels based on user criteria.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getHotelsByLocation } from '@/lib/data';
import type { Hotel } from '@/lib/types';

export const hotelRecommendationTool = ai.defineTool(
  {
    name: 'hotelRecommendationTool',
    description: 'Get hotel recommendations for a given location.',
    inputSchema: z.object({
      location: z.string().describe('The city and state to search for hotels in.'),
    }),
    outputSchema: z.object({
      hotels: z.array(z.object({
        name: z.string(),
        price: z.number(),
        rating: z.number(),
      })),
    }),
  },
  async (input) => {
    console.log(`Finding hotels in ${input.location}`);
    const hotels: Hotel[] = await getHotelsByLocation(input.location);
    return {
      hotels: hotels.map(({ name, price, rating }) => ({ name, price, rating })),
    };
  }
);
