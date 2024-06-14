import express, { Application } from 'express';
import bodyParser from 'body-parser';

const configureParsers = (app: Application) => {

    app.use(bodyParser.json({
        verify: (req, res, buf, encoding) => {
            //@ts-ignore
            req.rawBody = buf.toString();
        }
    }));

    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

};




export default configureParsers;
