import { Controller, Get, ClassMiddleware } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/forecast';
import { Request, Response } from 'express';

const forecast = new Forecast();

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController {
  @Get('')
  public async getForecastForgeLoggedUser(req: Request, res: Response): Promise<void> {
    try {
      const beaches = await Beach.find({ user: req.decoded?.id });
      const forecastData = await forecast.processForecastForBeaches(beaches);
      res.status(200).send(forecastData);
    }
    catch (error) {
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
}


// import { Controller, Get } from '@overnightjs/core';
// import { Request, Response } from 'express';

// @Controller('forecast')
// export class ForecastController {
//   @Get('')
//   public getForecastForLoggedUser(_: Request, res: Response): void {
//     res.send([
//       {
//         time: '2020-04-26T00:00:00+00:00',
//         forecast: [
//           {
//             lat: -33.792726,
//             lng: 151.289824,
//             name: 'Manly',
//             position: 'E',
//             rating: 2,
//             swellDirection: 64.26,
//             swellHeight: 0.15,
//             swellPeriod: 3.89,
//             time: '2020-04-26T00:00:00+00:00',
//             waveDirection: 231.38,
//             waveHeight: 0.47,
//             windDirection: 299.45,
//           },
//         ],
//       },
//       {
//         time: '2020-04-26T01:00:00+00:00',
//         forecast: [
//           {
//             lat: -33.792726,
//             lng: 151.289824,
//             name: 'Manly',
//             position: 'E',
//             rating: 2,
//             swellDirection: 123.41,
//             swellHeight: 0.21,
//             swellPeriod: 3.67,
//             time: '2020-04-26T01:00:00+00:00',
//             waveDirection: 232.12,
//             waveHeight: 0.46,
//             windDirection: 310.48,
//           },
//         ],
//       },
//     ]);
//   }
// }