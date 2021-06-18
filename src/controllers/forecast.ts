import { Controller, Get, ClassMiddleware, Middleware } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/forecast';
import ApiError from '@src/util/erros/api-error';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { BaseController } from '.';

const forecast = new Forecast();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  keyGenerator(req: Request): string {
    return req.ip;
  },
  handler(_, res: Response): void {
    res.status(429).send(ApiError.format({ code: 429, message: 'Too many requests to the /forecast endpoint' }))
  }
});

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController extends BaseController {
  @Get('')
  @Middleware(rateLimiter)
  public async getForecastForgeLoggedUser(req: Request, res: Response): Promise<void> {
    try {
      const beaches = await Beach.find({ user: req.decoded?.id });
      const forecastData = await forecast.processForecastForBeaches(beaches);
      res.status(200).send(forecastData);
    }
    catch (error) {
      this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' });
    }
  }
}



// import { Controller, Get, ClassMiddleware } from '@overnightjs/core';
// import logger from '@src/logger';
// import { authMiddleware } from '@src/middlewares/auth';
// import { Beach } from '@src/models/beach';
// import { Forecast } from '@src/services/forecast';
// import { Request, Response } from 'express';

// const forecast = new Forecast();

// @Controller('forecast')
// @ClassMiddleware(authMiddleware)
// export class ForecastController {
//   @Get('')
//   public async getForecastForgeLoggedUser(req: Request, res: Response): Promise<void> {
//     try {
//       const beaches = await Beach.find({ user: req.decoded?.id });
//       const forecastData = await forecast.processForecastForBeaches(beaches);
//       res.status(200).send(forecastData);
//     }
//     catch (error) {
//       logger.error(error);
//       res.status(500).send({ error: 'Something went wrong' });
//     }
//   }
// }