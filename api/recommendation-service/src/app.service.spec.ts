import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';

describe('AppService', () => {
  let appService: AppService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key, defaultValue) => {
      if (key === 'OPENWEATHER_API_KEY') return 'test_api_key';
      if (key === 'TOURISM_SERVICE_URL') return 'http://localhost:3001/api';
      return defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use fallback weather if API key is not configured', async () => {
    mockConfigService.get.mockImplementation((key, defaultValue) => {
      if (key === 'OPENWEATHER_API_KEY') return null;
      if (key === 'TOURISM_SERVICE_URL') return 'http://localhost:3001/api';
      return defaultValue;
    });

    mockHttpService.get.mockImplementation((url: string) => {
      if (url.includes('/tourism')) {
        return of({
          data: {
            success: true,
            data: [
              {
                id: 1,
                name: 'Taman Kelinci',
                isIndoor: false,
                latitude: -5.3951,
                longitude: 105.2012,
              },
            ],
          },
        });
      }
    });

    // Latitude -5.3951: Math.floor(Math.abs(-5.3951)) = 5 (odd) -> Clouds
    const result = await appService.getRecommendation(-5.3951, 105.2012);

    expect(result.success).toBe(true);
    expect(result.weather).toBe('Clouds');
    expect(result.source).toBe('fallback');
    expect(result.recommendations.length).toBe(1);
  });

  it('should use fallback weather if OpenWeather API returns an error', async () => {
    mockConfigService.get.mockImplementation((key, defaultValue) => {
      if (key === 'OPENWEATHER_API_KEY') return 'invalid_key';
      if (key === 'TOURISM_SERVICE_URL') return 'http://localhost:3001/api';
      return defaultValue;
    });

    mockHttpService.get.mockImplementation((url: string) => {
      if (url.includes('openweathermap.org')) {
        return throwError(() => ({
          response: { status: 401, data: { message: 'Invalid API key' } },
        }));
      }
      if (url.includes('/tourism')) {
        return of({
          data: {
            success: true,
            data: [
              {
                id: 1,
                name: 'Taman Kelinci',
                isIndoor: false,
                latitude: -4.2000,
                longitude: 105.2012,
              },
            ],
          },
        });
      }
    });

    // Latitude -4.2000: Math.floor(Math.abs(-4.2000)) = 4 (even) -> Clear
    const result = await appService.getRecommendation(-4.2000, 105.2012);

    expect(result.success).toBe(true);
    expect(result.weather).toBe('Clear');
    expect(result.source).toBe('fallback');
    expect(result.recommendations.length).toBe(1);
  });

  it('should filter only indoor places when weather is rainy', async () => {
    mockConfigService.get.mockImplementation((key, defaultValue) => {
      if (key === 'OPENWEATHER_API_KEY') return 'test_api_key';
      if (key === 'TOURISM_SERVICE_URL') return 'http://localhost:3001/api';
      return defaultValue;
    });

    mockHttpService.get.mockImplementation((url: string) => {
      if (url.includes('openweathermap.org')) {
        return of({
          data: {
            weather: [{ main: 'Rain', description: 'moderate rain' }],
            main: { temp: 22.5 },
          },
        });
      }
      if (url.includes('/tourism')) {
        return of({
          data: {
            success: true,
            data: [
              {
                id: 1,
                name: 'Taman Kelinci (Outdoor)',
                isIndoor: false,
                latitude: -5.3951,
                longitude: 105.2012,
              },
              {
                id: 2,
                name: 'Museum Lampung (Indoor)',
                isIndoor: true,
                latitude: -5.3812,
                longitude: 105.2501,
              },
            ],
          },
        });
      }
    });

    const result = await appService.getRecommendation(-5.3951, 105.2012);

    expect(result.success).toBe(true);
    expect(result.weather).toBe('Rain');
    expect(result.source).toBe('openweather');
    expect(result.recommendations.length).toBe(1);
    expect(result.recommendations[0].id).toBe(2);
    expect(result.recommendations[0].name).toBe('Museum Lampung (Indoor)');
  });

  it('should sort places by proximity (nearest first) when weather is clear', async () => {
    mockConfigService.get.mockImplementation((key, defaultValue) => {
      if (key === 'OPENWEATHER_API_KEY') return 'test_api_key';
      if (key === 'TOURISM_SERVICE_URL') return 'http://localhost:3001/api';
      return defaultValue;
    });

    mockHttpService.get.mockImplementation((url: string) => {
      if (url.includes('openweathermap.org')) {
        return of({
          data: {
            weather: [{ main: 'Clear', description: 'clear sky' }],
            main: { temp: 31.0 },
          },
        });
      }
      if (url.includes('/tourism')) {
        return of({
          data: {
            success: true,
            data: [
              {
                id: 1,
                name: 'Far Place',
                isIndoor: false,
                latitude: -6.0000,
                longitude: 106.0000,
              },
              {
                id: 2,
                name: 'Near Place',
                isIndoor: false,
                latitude: -5.3960,
                longitude: 105.2020,
              },
            ],
          },
        });
      }
    });

    const result = await appService.getRecommendation(-5.3951, 105.2012);

    expect(result.success).toBe(true);
    expect(result.weather).toBe('Clear');
    expect(result.recommendations.length).toBe(2);
    expect(result.recommendations[0].id).toBe(2);
    expect(result.recommendations[0].name).toBe('Near Place');
    expect(result.recommendations[0].distance).toBeLessThan(result.recommendations[1].distance);
  });
});
