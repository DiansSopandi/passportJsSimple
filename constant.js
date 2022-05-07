import { config } from 'dotenv';

config();

export const DOMAIN = process.env.DOMAIN;
export const PORT = process.env.PORT;
export const DBCONN = process.env.DBCONNLOCAL;
export const COOKIESECRET = process.env.COOKIESECRET;
export const CLIENTID = process.env.CLIENTID;
export const CLIENTSECRET = process.env.CLIENTSECRET;
