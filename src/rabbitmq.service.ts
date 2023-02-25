import { Injectable } from "@nestjs/common";
import { connect } from 'amqplib/callback_api';

@Injectable()
export class RabbitMQService {
  private connection: any;

  constructor() {
    connect(process.env.RABBITMQ_URI, (err: any, conn: any) => {
      this.connection = conn;
    });
  }

  public getConnection() {
    return this.connection;
  }
}