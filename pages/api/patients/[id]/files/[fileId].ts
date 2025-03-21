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

const allowedMethods: HTTPMethods[] = [HTTPMethods.GET, HTTPMethods.DELETE];

const getUploadedFile = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { jwtAccessToken } = req.cookies;
    const { userId } = getJwtTokenValues(jwtAccessToken || '');
    const { id: patientId, fileId } = req.query;

    const s3 = new S3({
      signatureVersion: 'v4',
      region: 'eu-north-1',
      accessKeyId: process.env.SW3_ACCESS_KEY,
      secretAccessKey: process.env.SW3_SECRET_ACCESS_KEY,
    });

    const key = `${userId}/${patientId}/${fileId}`;

    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Expires: 60,
    };

    const getPresignedUrl = await s3.getSignedUrl('getObject', s3Params);

    return res.status(200).json({
      success: true,
      message: 'file fetched successfully',
      data: {
        getPresignedUrl,
      },
    });
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

const deleteUploadedFiles = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { jwtAccessToken } = req.cookies;
    const { userId } = getJwtTokenValues(jwtAccessToken || '');
    const { id: patientId, fileId, historyEventId } = req.query;

    const s3 = new S3({
      signatureVersion: 'v4',
      region: 'eu-north-1',
      accessKeyId: process.env.SW3_ACCESS_KEY,
      secretAccessKey: process.env.SW3_SECRET_ACCESS_KEY,
    });

    const isPatientIdValid = patientId && isIdValid(patientId);

    if (isPatientIdValid) {
      const key = `${userId}/${patientId}/${fileId}`;
      const s3Params = {
        Bucket: process.env.BUCKET_NAME || '',
        Key: key,
      };

      await connectDB();

      await s3
        .deleteObject(s3Params, async (err, data) => {
          if (err === null) {
            const updatedPatient = await PatientModel.findOneAndUpdate(
              {
                _id: patientId,
                history: {
                  $elemMatch: {
                    _id: historyEventId,
                    files: {
                      $elemMatch: {
                        uniqueId: fileId,
                      },
                    },
                  },
                },
              },
              {
                $pull: {
                  'history.$.files': {
                    uniqueId: fileId,
                  },
                },
              },
              { new: true }
            ).select('-history -createdAt -updatedAt');

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
                `Unable to find the event you requested with id: ${historyEventId}`,
                404
              );
            }
          } else {
            return res.status(400).json({
              success: false,
              message: 'Deletion of file failed',
              data: null,
            });
          }
        })
        .promise();
    } else {
      return generateResponse(
        res,
        false,
        `Unable to find the patient you requested with id: ${patientId}`,
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
  GET: getUploadedFile,
  DELETE: deleteUploadedFiles,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const isRequestAllowed =
    req.method != undefined &&
    allowedMethods.includes(req.method as HTTPMethods);

  try {
    if ((req.method === 'GET' || req.method === 'DELETE') && isRequestAllowed) {
      await protectedRoute(req, res, handleHttpMethods[req.method]);
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
