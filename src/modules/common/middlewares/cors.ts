import cors from 'cors';
import { Application } from 'express';

const corsMiddleware = (app: Application) => {
  app.use(cors({ origin: '*' }));
};

export default corsMiddleware;
