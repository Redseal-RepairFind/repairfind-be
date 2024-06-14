import * as Sentry from '@sentry/node';
import { config } from '../../../config';
import { Application } from 'express';

const sentryMiddleware = (app: Application) => {
    Sentry.init({
        dsn: config.sentry.dsn,
        integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new Sentry.Integrations.Express({ app }),
            // Replace with your node profiling integration if necessary
        ],
        tracesSampleRate: 1.0, // Capture 100% of transactions
        profilesSampleRate: 1.0,
    });

    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());

    app.use(Sentry.Handlers.errorHandler());
};

export default sentryMiddleware;
