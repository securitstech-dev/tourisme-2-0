import express from 'express';

// Instance réutilisée entre les invocations serverless
let cachedApp: express.Express | null = null;

async function createApp(): Promise<express.Express> {
  const [{ NestFactory }, { ValidationPipe }, { ExpressAdapter }] = await Promise.all([
    import('@nestjs/core'),
    import('@nestjs/common'),
    import('@nestjs/platform-express'),
  ]);
  const { AppModule } = require('../src/app.module');

  const expressInstance = express();
  const adapter = new ExpressAdapter(expressInstance);

  const app = await NestFactory.create(AppModule, adapter, {
    logger: ['error', 'warn', 'log'],
  });

  app.setGlobalPrefix('api');
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3000', /\.vercel\.app$/],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  return expressInstance;
}

export default async function handler(req: any, res: any) {
  if (req.url === '/api/ping' || req.url === '/ping') {
    return res.status(200).json({
      status: 'ok',
      service: 'congo-tourisme-backend',
    });
  }

  try {
    if (!cachedApp) {
      cachedApp = await createApp();
    }

    cachedApp(req, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    console.error('Backend startup failed:', message);

    res.status(500).json({
      statusCode: 500,
      message: 'Backend startup failed. Check Vercel Runtime Logs for details.',
    });
  }
}
