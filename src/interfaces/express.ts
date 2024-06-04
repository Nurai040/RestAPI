import { Request } from 'express';

export type ExtendedRequest = Request & { id: string };
