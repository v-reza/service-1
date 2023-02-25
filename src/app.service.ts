import {
  Injectable,
  Logger,
  Inject,
  OnApplicationShutdown,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import {
  firstValueFrom,
  forkJoin,
  lastValueFrom,
  map,
  Observable,
  retry,
} from 'rxjs';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  // private client: ClientProxy;

  constructor(@Inject('SERVICE_2') private client: ClientProxy) {
    // this.client = ClientProxyFactory.create({
    //   transport: Transport.RMQ,
    //   options: {
    //     urls: [process.env.RABBITMQ_URI],
    //     queue: 'service2_queue',
    //     queueOptions: {
    //       durable: false,
    //     },
    //   },
    // });
  }

  getHello(): string {
    return 'Hello World!';
  }

  async healthCheck() {
    try {
      const result = await lastValueFrom(
        this.client.send('healthcheck', {}).pipe(retry(3)),
      );
      // Remote service is healthy
      return { status: 'ok', data: result };
    } catch (err) {
      // Remote service is down
      return { status: 'error', message: err.message };
    }
  }

  async sendToService2() {
    const message1 = { id: 1, content: 'Hello, world!' };
    const message2 = { id: 2, content: 'Hello, again!' };
    // await lastValueFrom(this.client.send('SERVICE_UP', message1));
    // await lastValueFrom(this.client.send('SERVICE_2', message2));

    const send1 = await lastValueFrom(
      this.client.send('SERVICE_2', message1).pipe(
        map((response: any) => {
          console.log('response: ', response);
          return response;
        }),
        retry(3),
      ),
    );

    const send2 = await lastValueFrom(
      this.client.send('SERVICE_2', message2).pipe(
        map((response: any) => {
          console.log('response2: ', response);
          return response;
        }),
        retry(3),
      ),
    );
    // console.log({ send1 });
    // console.log({ send2 });
    // await lastValueFrom(this.client.send('SERVICE_UP', 'This message send to service2'));
    // this.client.send('SERVICE_UP', 'update').subscribe();
    // const result2 = await firstValueFrom()

    return 'oke';
    // console.log('result: ', result)
    // return datas
    // return result.subscribe((data: any) => {
    //   return data
    // });
  }

  async logMessage() {
    this.logger.log('This message send to service2');
  }

  // onApplicationShutdown(signal?: string): void {
  //   console.log('Closing AMQP connection...');
  //   this.client.close();
  // }
}
