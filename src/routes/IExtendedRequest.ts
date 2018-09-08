import { IBlog } from './../database/helpers/IBlog';
import { Request } from 'express';

export interface ISession extends Request {
    current_url: string;
    access_token: string;
    blog_redirect: string;
    blogger: IBlog;
    steemconnect: any
}

export interface IExtendedRequest extends Request {
    session: ISession;
}