import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('send-to-service2')
  sendToService2() {
    return this.appService.sendToService2();
  }

  @Get('healthcheck')
  healthCheck() {
    return this.appService.healthCheck()
  }
}
