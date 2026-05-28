import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { getDistance } from 'geolib';

interface TourismPlace {
  id: number;
  name: string;
  nameFilter: string;
  description: string;
  category: string;
  isIndoor: boolean;
  latitude: number;
  longitude: number;
  rating: number;
  imageUrl?: string;
  createdAt: string;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getRecommendation(lat: number, lng: number) {
    const tourismServiceUrl = this.configService.get<string>(
      'TOURISM_SERVICE_URL',
      'http://localhost:3001/api',
    );
    const openWeatherApiKey = this.configService.get<string>('OPENWEATHER_API_KEY');

    // 1. Fetch current weather from OpenWeatherMap API with robust fallback system
    let weatherCondition = 'Clear';
    let temp = 27; // Default fallback temperature in Celsius
    let weatherDescription = 'clear sky';
    let weatherSource = 'openweather';

    if (!openWeatherApiKey) {
      this.logger.warn('OPENWEATHER_API_KEY is not configured in the environment. Switching to fallback weather.');
      weatherSource = 'fallback';
      
      // Fallback Weather Logic:
      // Even latitude -> Clear, Odd latitude -> Clouds
      const latInt = Math.floor(Math.abs(lat));
      weatherCondition = latInt % 2 === 0 ? 'Clear' : 'Clouds';
      weatherDescription = weatherCondition === 'Clear' ? 'clear sky' : 'scattered clouds';
    } else {
      try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${openWeatherApiKey}&units=metric`;
        this.logger.log(`Fetching weather from: ${weatherUrl.replace(openWeatherApiKey, '***')}`);

        const weatherResponse = await firstValueFrom(
          this.httpService.get(weatherUrl),
        );

        const weatherData = weatherResponse.data;
        if (weatherData && weatherData.weather && weatherData.weather[0]) {
          weatherCondition = weatherData.weather[0].main;
          weatherDescription = weatherData.weather[0].description;
        }
        if (weatherData && weatherData.main) {
          temp = weatherData.main.temp;
        }
        weatherSource = 'openweather';
        this.logger.log(`Current Weather: ${weatherCondition} (${weatherDescription}), Temp: ${temp}°C`);
      } catch (error: any) {
        // Log the error internally and do not return error stack to the user
        const message = error.response?.data?.message || error.message || 'Error calling OpenWeather API';
        this.logger.error(`OpenWeather failed, switching to fallback weather. Details: ${message}`);

        weatherSource = 'fallback';
        // Fallback Weather Logic
        const latInt = Math.floor(Math.abs(lat));
        weatherCondition = latInt % 2 === 0 ? 'Clear' : 'Clouds';
        weatherDescription = weatherCondition === 'Clear' ? 'clear sky' : 'scattered clouds';
      }
    }

    // 2. Fetch tourism places from tourism-service
    let tourismPlaces: TourismPlace[] = [];
    try {
      const tourismUrl = `${tourismServiceUrl}/tourism`;
      this.logger.log(`Fetching tourism places from: ${tourismUrl}`);

      const tourismResponse = await firstValueFrom(
        this.httpService.get(tourismUrl),
      );

      if (tourismResponse.data && Array.isArray(tourismResponse.data.data)) {
        tourismPlaces = tourismResponse.data.data;
      } else if (Array.isArray(tourismResponse.data)) {
        tourismPlaces = tourismResponse.data;
      }
      this.logger.log(`Fetched ${tourismPlaces.length} tourism places`);
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data?.message || error.message || 'Error calling Tourism Service';
      this.logger.error(`Tourism Service error: ${message} (Status: ${status})`);
      throw new HttpException(
        `Gagal mendapatkan data wisata dari tourism-service: ${message}`,
        status,
      );
    }

    // 3. Weather-aware Recommendation Logic
    const isRainy = ['rain', 'drizzle', 'thunderstorm'].includes(
      weatherCondition.toLowerCase(),
    );

    let recommendedPlaces: TourismPlace[] = [];

    if (isRainy) {
      // Rainy weather: filter indoor places
      recommendedPlaces = tourismPlaces.filter((place) => place.isIndoor === true);
      this.logger.log(`Rainy weather detected. Filtered ${recommendedPlaces.length} indoor places.`);
    } else {
      // Clear/Cloudy weather: sort by proximity (nearest first) using geolib
      recommendedPlaces = [...tourismPlaces].sort((a, b) => {
        const distA = getDistance(
          { latitude: lat, longitude: lng },
          { latitude: a.latitude, longitude: a.longitude },
        );
        const distB = getDistance(
          { latitude: lat, longitude: lng },
          { latitude: b.latitude, longitude: b.longitude },
        );
        return distA - distB;
      });
      this.logger.log('Clear/Cloudy weather detected. Sorted places by proximity.');
    }

    // Map output with calculated distance
    const finalData = recommendedPlaces.map((place) => {
      const distance = getDistance(
        { latitude: lat, longitude: lng },
        { latitude: place.latitude, longitude: place.longitude },
      );
      return {
        ...place,
        distance, // in meters
      };
    });

    return {
      success: true,
      weather: weatherCondition,
      source: weatherSource,
      recommendations: finalData,
      metadata: {
        status: HttpStatus.OK,
        user_coordinates: { latitude: lat, longitude: lng },
        weather_detail: {
          condition: weatherCondition,
          description: weatherDescription,
          temp,
        },
        total_recommended: finalData.length,
      },
    };
  }
}
