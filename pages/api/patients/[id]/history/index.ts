import { S3 } from 'aws-sdk';
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

const allowedMethods: HTTPMethods[] = [HTTPMethods.POST];

const addNewHistoryEvent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { jwtAccessToken } = req.cookies;
    const { userId } = getJwtTokenValues(jwtAccessToken || '');
    const { id: patientId } = req.query;

    if (userId) {
      if (patientId && isIdValid(patientId)) {
        const { appointmentDate, teethTasks, fullMouthTasks, files } =
          JSON.parse(req.body);

        // TODO Validate newHistoryEvent;

        if (
          appointmentDate &&
          teethTasks &&
          fullMouthTasks &&
          files &&
          files.length >= 0
        ) {
          await connectDB();

          const updatedPatient = await PatientModel.findByIdAndUpdate(
            patientId,
            {
              $push: {
                history: {
                  appointmentDate,
                  teethTasks,
                  fullMouthTasks,
                  files,
                },
              },
            },
            { new: true }
          ).select('-createdAt -updatedAt');

          const lastlyAddedHistoryEvent =
            updatedPatient.history[updatedPatient.history.length - 1];

          if (updatedPatient) {
            const s3 = new S3({
              signatureVersion: 'v4',
              region: 'eu-north-1',
              accessKeyId: process.env.SW3_ACCESS_KEY,
              secretAccessKey: process.env.SW3_SECRET_ACCESS_KEY,
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const filesToUpload: any[] = [];

            for (let i = 0; i < files.length; i++) {
              // TODO CREATE A UNIQUE ID for each signed url for each file
              const key = `${userId}/${patientId}/${files[i].uniqueId}`;

              // since the Db is updated with the provided info
              // we can now upload the files to s3
              const s3Params = {
                Bucket: process.env.BUCKET_NAME,
                Key: key,
                Expires: 60,
                ContentType: `${files[i].uploadFileType}`,
              };

              // generate a presigned url for the client to upload the files to s3
              const uploadUrl = await s3.getSignedUrl('putObject', s3Params);
              filesToUpload.push({
                key: key,
                uploadUrl,
              });
            }

            return generateResponse(
              res,
              true,
              'patient updated successfully',
              200,
              { createdHistoryEvent: lastlyAddedHistoryEvent, filesToUpload }
            );
          } else {
            return generateResponse(
              res,
              false,
              'Unable to find patient you requested for update',
              404
            );
          }
        } else {
          return generateResponse(
            res,
            false,
            'The history event you provided is not valid',
            400
          );
        }
      } else {
        return generateResponse(
          res,
          false,
          'The patient id you provided is not valid',
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
  POST: addNewHistoryEvent,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const isRequestAllowed =
    req.method != undefined &&
    allowedMethods.includes(req.method as HTTPMethods);

  try {
    if (req.method === 'POST' && isRequestAllowed) {
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
