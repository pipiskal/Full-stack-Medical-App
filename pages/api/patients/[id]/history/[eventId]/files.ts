import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/middleware/connectDB';
import protectedRoute from '@/middleware/protectedRoute';
import PatientModel from '@/models/PatientModel';
import {
  generateCatchErrorResponse,
  generateResponse,
  getJwtTokenValues,
  isIdValid,
} from '@/modules/helpersBE';
import { HTTPMethods, PatientType } from '@/typesBE';

const allowedMethods: HTTPMethods[] = [HTTPMethods.DELETE, HTTPMethods.PATCH];

const deleteFilesFromHistoryEvent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { jwtAccessToken } = req.cookies;
    const { userId } = getJwtTokenValues(jwtAccessToken || '');
    const { id: patientId, eventId } = req.query;

    const isPatientAndEventIdValid =
      patientId && eventId && isIdValid(patientId) && isIdValid(eventId);

    const body = JSON.parse(req.body);

    if (userId) {
      if (isPatientAndEventIdValid) {
        const { filesToDelete } = body;
        await connectDB();

        const patient = await PatientModel.findOne({ _id: patientId });

        const history = patient?.history;

        const updatedHistory = history.map(
          (historyEvent: PatientType['history']) => {
            const filteredFiles = historyEvent.files.filter(
              (file) => !filesToDelete.includes(file.uniqueId)
            );
            return {
              _id: historyEvent._id,
              fullMouthTasks: historyEvent.fullMouthTasks,
              appointmentDate: historyEvent.appointmentDate,
              teethTasks: historyEvent.teethTasks,
              files: filteredFiles,
            };
          }
        );

        const updatedPatient = await PatientModel.findOneAndUpdate(
          { _id: patientId },
          {
            history: updatedHistory,
          },
          { new: true }
        );

        if (updatedPatient) {
          return generateResponse(
            res,
            true,
            'deleted history event successfully',
            200,
            updatedPatient
          );
        } else {
          return generateResponse(
            res,
            false,
            `Unable to find the event you requested with id: ${eventId}`,
            404
          );
        }
      } else {
        return generateResponse(
          res,
          false,
          'The patient or the event id you provided is not valid',
          400
        );
      }
    } else {
      return generateResponse(
        res,
        false,
        'Unable to find User from provided Tokens',
        404
      );
    }
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

const handleHttpMethods: {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
} = {
  DELETE: deleteFilesFromHistoryEvent,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const isRequestAllowed =
    req.method != undefined &&
    allowedMethods.includes(req.method as HTTPMethods);

  try {
    if (req.method === 'DELETE' && isRequestAllowed) {
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
