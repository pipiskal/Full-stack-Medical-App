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
import { HTTPMethods } from '@/typesBE';

const allowedMethods: HTTPMethods[] = [HTTPMethods.DELETE, HTTPMethods.PATCH];

const deleteHistoryEvent = async (
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

        const updatedPatient = await PatientModel.findOneAndUpdate(
          { _id: patientId },
          { $pull: { history: { _id: eventId } } },
          { new: true }
        ).select('-history -createdAt -updatedAt');

        if (updatedPatient) {
          const s3 = new S3({
            signatureVersion: 'v4',
            region: 'eu-north-1',
            accessKeyId: process.env.SW3_ACCESS_KEY,
            secretAccessKey: process.env.SW3_SECRET_ACCESS_KEY,
          });

          for (let i = 0; i < filesToDelete.length; i++) {
            const key = `${userId}/${patientId}/${filesToDelete[i]}`;

            const s3Params = {
              Bucket: process.env.BUCKET_NAME || '',
              Key: key,
            };

            await s3.deleteObject(s3Params).promise();
          }

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

const updateHistoryEvent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { jwtAccessToken } = req.cookies;
    const { userId } = getJwtTokenValues(jwtAccessToken || '');
    const { id: patientId, eventId } = req.query;

    const isPatientAndEventIdValid =
      patientId && eventId && isIdValid(patientId) && isIdValid(eventId);

    if (userId) {
      // TODO Validate newHistoryEven and filesToDelete
      const body = JSON.parse(req.body);

      const { formattedPayload: newHistoryEvent, filesToDelete } = body;

      const clearedNewHistoryEvent = {
        ...newHistoryEvent,
        files: newHistoryEvent.files
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            newHistoryEvent.files.map((file: any) => {
              const { isForUpload, ...rest } = file;
              return {
                ...rest,
              };
            })
          : [],
      };

      if (isPatientAndEventIdValid && clearedNewHistoryEvent) {
        await connectDB();

        const updatedPatient = await PatientModel.findOneAndUpdate(
          { _id: patientId, 'history._id': eventId },
          {
            $set: {
              'history.$': clearedNewHistoryEvent,
            },
          },
          { new: true }
        ).select('-history -createdAt -updatedAt');

        if (updatedPatient) {
          const files = newHistoryEvent?.files || [];

          const filesToUpload = [];

          const filesToMap = files.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (file: any) => file.isForUpload === true
          );

          const s3 = new S3({
            signatureVersion: 'v4',
            region: 'eu-north-1',
            accessKeyId: process.env.SW3_ACCESS_KEY,
            secretAccessKey: process.env.SW3_SECRET_ACCESS_KEY,
          });

          for (let i = 0; i < filesToDelete.length; i++) {
            // TODO CREATE A UNIQUE ID for each signed url for each file
            const key = `${userId}/${patientId}/${filesToDelete[i].uniqueId}`;

            const s3Params = {
              Bucket: process.env.BUCKET_NAME || '',
              Key: key,
            };

            await s3.deleteObject(s3Params).promise();
          }

          for (let i = 0; i < filesToMap.length; i++) {
            // TODO CREATE A UNIQUE ID for each signed url for each file
            const key = `${userId}/${patientId}/${filesToMap[i].uniqueId}`;

            // since the Db is updated with the provided info
            // we can now upload the files to s3
            const s3Params = {
              Bucket: process.env.BUCKET_NAME,
              Key: key,
              Expires: 60,
              ContentType: `${filesToMap[i].uploadFileType}`,
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
            { createdPatient: updatedPatient, filesToUpload }
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
  DELETE: deleteHistoryEvent,
  PATCH: updateHistoryEvent,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const isRequestAllowed =
    req.method != undefined &&
    allowedMethods.includes(req.method as HTTPMethods);

  try {
    if (
      (req.method === 'DELETE' || req.method === 'PATCH') &&
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
