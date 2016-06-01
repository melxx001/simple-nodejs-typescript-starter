import {Request, Response} from 'express';

export interface DevMessage {
  dev_message?: string;
  stack?: any;
  show?: Boolean;
}

export interface Error {
  status?: number;
  message: string;
  stack?: any;
}

export interface CustomRequest extends Request {
  t?: Function;
  tn?: Function;
}

export interface CustomResponse extends Response {
  t?: Function;
  tn?: Function;
}
