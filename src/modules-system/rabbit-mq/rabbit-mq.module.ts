import { Global, Inject, Module } from '@nestjs/common';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import e from 'express';
import { RABBITMQ_URL } from 'src/common/constant/app.constant';
import { ORDER_SERVICE } from 'src/common/constant/rabbit-mq.constant';

@Global()
@Module({
  imports: [
    //tạo ra sender để gửi message đến RabbitMQ
    ClientsModule.register([
      {
        name: ORDER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL as string],
          queue: 'orders_queue',
          queueOptions: {
            durable: true, // nếu server restart/down thì queue sẽ không bị mất
          },
          socketOptions: {
            connectionOption: {
              ClientProperties: {
                connection_name: 'order-send',
              },
            },
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMqModule {
  constructor(@Inject(ORDER_SERVICE) private client: ClientProxy) {}
  async onModuleInit() {
    try {
      const result = await this.client.connect();
      console.log(
        '✅ [RABBITMQ] Connection has been established successfully.',
      );
    } catch (error) {
      console.log('❌ [RABBITMQ] Failed to connect.', error);
    }
  }
}
