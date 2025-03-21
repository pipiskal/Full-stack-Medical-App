import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/middleware/connectDB';
import CalendarEventModel from '@/models/CalendarEventModel';
import {
  generateCatchErrorResponse,
  generateResponse,
} from '@/modules/helpersBE';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const deletedEvents = await CalendarEventModel.deleteMany({
      date: { $lte: twoMonthsAgo },
    });

    if (deletedEvents && deletedEvents.deletedCount >= 0) {
      console.log(
        `Deleted ${deletedEvents.deletedCount} events older than ${twoMonthsAgo}`
      );
    } else {
      console.log(`No events older than ${twoMonthsAgo} to delete`);
    }

    return generateResponse(res, true, 'Deleted old events', 200);
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
}
