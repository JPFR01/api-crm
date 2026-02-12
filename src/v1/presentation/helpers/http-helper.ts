import {Error} from '@/v1/domain/shared/errors/Error';
import {HttpResponse} from '@/v1/presentation/protocols/Http';
import {HttpStatusCode} from 'axios';

export const serverError = (error: Error): HttpResponse => errorHttpHelper(error, HttpStatusCode.InternalServerError);

export const notImplemented = (error: Error): HttpResponse => errorHttpHelper(error, HttpStatusCode.NotImplemented);

export const badRequest = (error: Error): HttpResponse => errorHttpHelper(error, HttpStatusCode.BadRequest);

export const preconditionFailed = (error: Error): HttpResponse => errorHttpHelper(error, HttpStatusCode.PreconditionFailed);

export const unauthorized = (error: Error): HttpResponse => errorHttpHelper(error, HttpStatusCode.Unauthorized);

export const notFound = (error: Error): HttpResponse => errorHttpHelper(error, HttpStatusCode.NotFound);

export const requestTimeout = (error: Error): HttpResponse => errorHttpHelper(error, HttpStatusCode.RequestTimeout);

export const forbidden = (error: Error): HttpResponse => errorHttpHelper(error, HttpStatusCode.Forbidden);

export const conflict = (error: Error): HttpResponse => errorHttpHelper(error, HttpStatusCode.Conflict);

export const unassigned = (error: Error, code: number): HttpResponse => {
    error.status = !error.status ? code : error.status;
    return {
        statusCode: code,
        body: error,
    };
};

export const noContent = (message?: string): HttpResponse =>
    message
        ? {
              statusCode: 204,
              body: {
                  mensagem: message,
              },
          }
        : {
              statusCode: 204,
              body: {},
          };

export const created = (data?: any): HttpResponse => ({
    statusCode: 201,
    body: data ? {data} : undefined,
});

export const ok = (data: any): HttpResponse => ({
    statusCode: 200,
    body: data ? {data} : {},
});

function errorHttpHelper(error: Error, code: HttpStatusCode): HttpResponse {
    error.status = !error.status ? code : error.status;
    return {
        statusCode: code,
        body: error,
    };
}
