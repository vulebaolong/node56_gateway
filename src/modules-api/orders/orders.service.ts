import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import type { Users } from 'src/modules-system/prisma/generated/prisma/client';
import { ORDER_SERVICE } from 'src/common/constant/rabbit-mq.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(@Inject(ORDER_SERVICE) private client: ClientProxy) {}

  async create(createOrderDto: CreateOrderDto, user: Users) {
    const data = { userId: user.id, foodId: createOrderDto.foodId };

    //send: gửi message đến RabbitMQ thông qua client đã inject,
    // bọc với lastValueFrom để đảm bảo nhận được kết quả trả về từ microservice.
    // @messagepattern dùng dể nhận tín hiệu khi sử dụng send của client RabbitMQ.
    console.log(data);
    const result = await lastValueFrom(this.client.send('create_order', data));

    return result;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
