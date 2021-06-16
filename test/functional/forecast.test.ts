import { Beach, BeachPosition } from '@src/models/beach';
import nock from 'nock';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import apiForecastResponse1BeachFixture from '@test/fixtures/api_forecast_response_1_beach.json';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';

describe('Beach forecast functional tests', () => {
  const defaultUser: User = {
    name: 'John Doe',
    email: 'john3@mail.com',
    password: '1234'
  };
  let token: string;
  beforeEach(async () => {
    await Beach.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();

    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
      user: user.id
    };
    await new Beach(defaultBeach).save();
    token = AuthService.generateToken(user.toJSON());
  });

  it('should return a forecast with just a few times', async () => {
    // nock.recorder.rec();
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true
      }
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({ "params": "swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed", "source": "noaa", "lat": "-33.792726", "lng": "151.289824" })
      .reply(200, stormGlassWeather3HoursFixture);


    const { body, status } = await global.testRequest.get('/forecast').set({ 'x-access-token': token });
    expect(status).toBe(200);
    expect(body).toEqual(apiForecastResponse1BeachFixture);
  });

  it('should return 500 if something goes wrong during the processing', async () => {
    // nock.recorder.rec();
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true
      }
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query(
        {
          "params": "swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed",
          "source": "noaa",
          "end": "1592113802",
          "lat": "-33.792726",
          "lng": "151.289824"
        })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest.get('/forecast').set({ 'x-access-token': token });
    expect(status).toBe(500);
  });
});
