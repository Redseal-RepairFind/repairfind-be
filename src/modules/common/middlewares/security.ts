import { Application } from 'express';
import helmet from 'helmet';

const securityMiddleware = (app:Application) => {
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP
    expectCt: { enforce: true, maxAge: 30 },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }));
};

export default securityMiddleware;
