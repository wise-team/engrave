import { Request } from 'express';

export interface IExtendedRequest extends Request {
    session: any;
}