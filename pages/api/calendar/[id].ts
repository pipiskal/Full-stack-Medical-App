import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/middleware/connectDB';
import protectedRoute from '@/middleware/protectedRoute';
import CalendarEventModel from '@/models/CalendarEventModel';
import {
  generateCatchErrorResponse,
  generateResponse,
  getJwtTokenValues,
  isIdValid,
} from '@/modules/helpersBE';
import { HTTPMethods } from '@/typesBE';

const allowedMethods: HTTPMethods[] = [HTTPMethods.PATCH, HTTPMethods.DELETE];

// All the functions below implemented CRUD operations for a specific user
// We get that user from the provided JWT token

const updateCalendarEvent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { title, description, date, startingTime, endingTime, color } =
      JSON.parse(req.body);

    const { jwtAccessToken } = req.cookies;
    const { userId } = getJwtTokenValues(jwtAccessToken || '');

    const isBodyLegit = title && date && startingTime && endingTime && color;

    // TODO - add validation for the body

    if (userId && isBodyLegit) {
      const { id: calendarId } = req.query;

      if (calendarId && isIdValid(calendarId)) {
        await connectDB();

        const updatedEvent = await CalendarEventModel.findOneAndUpdate(
          { _id: calendarId, userId: userId },
          {
            $set: {
              title: title,
              description: description,
              date: date,
              startingTime: startingTime,
              endingTime: endingTime,
              color: color,
            },
          },
          {
            returnOriginal: false,
          }
        ).select('title description date startingTime endingTime color');

        if (updatedEvent) {
          return generateResponse(
            res,
            true,
            'successful event update',
            200,
            updatedEvent
          );
        } else {
          return generateResponse(res, false, 'event not found', 404);
        }
      } else {
        return generateResponse(
          res,
          false,
          'The calendar id you provided is not valid',
          400
        );
      }
    }

    return generateResponse(
      res,
      false,
      'The event body or the userId you provided is not valid',
      400
    );
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

const deleteCalendarEvent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { jwtAccessToken } = req.cookies;
    const { userId } = getJwtTokenValues(jwtAccessToken || '');

    if (userId) {
      const { id: calendarId } = req.query;

      if (calendarId && isIdValid(calendarId)) {
        await connectDB();
        const deletedEvent = await CalendarEventModel.findOneAndDelete(
          {
            _id: calendarId,
            userId: userId,
          },
          {
            returnOriginal: true,
          }
        );

        if (deletedEvent) {
          return generateResponse(
            res,
            true,
            'successful event deletion',
            200,
            deletedEvent
          );
        } else {
          return generateResponse(res, false, 'event not found', 404);
        }
      } else {
        return generateResponse(
          res,
          false,
          'The calendar id you provided is not valid',
          400
        );
      }
    }

    return generateResponse(
      res,
      false,
      'The event body or the userId you provided is not valid',
      400
    );
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

const handleHttpMethods: {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
} = {
  PATCH: updateCalendarEvent,
  DELETE: deleteCalendarEvent,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const isRequestAllowed =
    req.method != undefined &&
    allowedMethods.includes(req.method as HTTPMethods);

  try {
    if (
      (req.method === 'PATCH' || req.method === 'DELETE') &&
      isRequestAllowed
    ) {
      return await protectedRoute(req, res, handleHttpMethods[req.method]);
    } else {
      return res.status(400).json({
        success: false,
        message: `${req.method} is not allowed for this route`,
      });
    }
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

export default handler;
