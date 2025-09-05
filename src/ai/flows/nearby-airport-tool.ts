'use server';
/**
 * @fileoverview A tool for finding nearby airports to a given airport code.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const nearbyAirportTool = ai.defineTool(
  {
    name: 'findNearbyAirports',
    description:
      'Finds up to 3 nearby airports to a given IATA airport code.',
    inputSchema: z.object({
      airportCode: z
        .string()
        .describe('The IATA code of the airport to find nearby airports for.'),
    }),
    outputSchema: z.object({
      airports: z.array(
        z.object({
          code: z.string().describe('The IATA code of the nearby airport.'),
          name: z.string().describe('The name of the nearby airport.'),
        })
      ),
    }),
  },
  async ({ airportCode }) => {
    // In a real application, you might use the Google Places API or another airport data source.
    // For this example, we'll return a static list based on the input.
    console.log(`Finding nearby airports for ${airportCode}`);
    const nearby: Record<string, { code: string; name: string }[]> = {
      CXB: [{ code: 'CGP', name: 'Shah Amanat International Airport' }],
      CGP: [{ code: 'CXB', name: "Cox's Bazar Airport" }],
      JFK: [
        { code: 'LGA', name: 'LaGuardia Airport' },
        { code: 'EWR', name: 'Newark Liberty International Airport' },
      ],
      LHR: [
        { code: 'LGW', name: 'Gatwick Airport' },
        { code: 'STN', name: 'Stansted Airport' },
        { code: 'LCY', name: 'London City Airport' },
      ],
    };
    return { airports: nearby[airportCode] || [] };
  }
);

export const findNearbyAirportsFlow = ai.defineFlow(
  {
    name: 'findNearbyAirportsFlow',
    inputSchema: z.object({ airportCode: z.string() }),
    outputSchema: z.any(),
  },
  async ({ airportCode }) => {
    const { output } = await nearbyAirportTool({ airportCode });
    return output;
  }
);
