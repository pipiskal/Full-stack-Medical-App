import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/middleware/connectDB';
import protectedRoute from '@/middleware/protectedRoute';
import CalendarEventModel from '@/models/CalendarEventModel';
import {
  generateCatchErrorResponse,
  generateResponse,
  getJwtTokenValues,
} from '@/modules/helpersBE';
import { HTTPMethods } from '@/typesBE';

const allowedMethods: HTTPMethods[] = [HTTPMethods.POST, HTTPMethods.GET];

// All the functions below implemented CRUD operations for a specific user
// We get that user from the provided JWT token

const remove2monthsFromDate = (date: Date) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - 2);
  return newDate;
};

const createNewCalendarEvent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { jwtAccessToken } = req.cookies;
    const { userId } = getJwtTokenValues(jwtAccessToken || '');

    if (userId) {
      // Get data from body
      const { title, description, date, startingTime, endingTime, color } =
        JSON.parse(req.body);

      const isDateLegit =
        date && new Date(date) > remove2monthsFromDate(new Date());

      if (!isDateLegit)
        return generateResponse(
          res,
          false,
          'The date of creation cannot be older than 2 months',
          400
        );

      //TODO - add validation for the body
      const isBodyLegit = title && date && startingTime && endingTime && color;

      if (isBodyLegit) {
        await connectDB();

        const calendarEvent = await CalendarEventModel.create({
          userId,
          title,
          description,
          date,
          startingTime,
          endingTime,
          color,
        });

        if (calendarEvent) {
          return generateResponse(
            res,
            true,
            'Event created',
            201,
            calendarEvent
          );
        } else {
          return generateResponse(res, false, 'Event not created', 400);
        }
      }
    }
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

const getCalendarEvents = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { jwtAccessToken } = req.cookies;
    const { userId } = getJwtTokenValues(jwtAccessToken || '');

    if (userId) {
      await connectDB();

      const eventsArray = await CalendarEventModel.find({ userId: userId });

      if (eventsArray) {
        return generateResponse(
          res,
          true,
          'successful events retrieval',
          200,
          eventsArray
        );
      } else {
        return generateResponse(res, false, 'events not found', 404);
      }
    }
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

const handleHttpMethods: {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
} = {
  POST: createNewCalendarEvent,
  GET: getCalendarEvents,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const isRequestAllowed =
    req.method != undefined &&
    allowedMethods.includes(req.method as HTTPMethods);

  try {
    if ((req.method === 'GET' || req.method === 'POST') && isRequestAllowed) {
      return await protectedRoute(req, res, handleHttpMethods[req.method]);
    } else {
      return res.status(400).json({
        success: false,
        message: `${req.method} is not allowed for this route`,
        statusCode: 400,
      });
    }
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

export default handler;
