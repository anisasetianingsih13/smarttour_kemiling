import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BadRequestException, HttpException } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockAppService = {
    getRecommendation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /recommendation parameters validation', () => {
    it('should throw BadRequestException if lat is missing', async () => {
      await expect(
        appController.getRecommendation(undefined, '105.2662'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if lng is missing', async () => {
      await expect(
        appController.getRecommendation('-5.3972', undefined),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if coordinates are invalid strings', async () => {
      await expect(
        appController.getRecommendation('not-a-number', '105.2662'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should call service.getRecommendation when parameters are valid', async () => {
      mockAppService.getRecommendation.mockResolvedValue({ success: true });
      const res = await appController.getRecommendation('-5.3972', '105.2662');
      expect(res).toEqual({ success: true });
      expect(mockAppService.getRecommendation).toHaveBeenCalledWith(-5.3972, 105.2662);
    });
  });
});
