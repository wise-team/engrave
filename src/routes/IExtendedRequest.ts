import * as express from 'express';

export interface IExtendedRequest extends express.Request {
    session: any;
}