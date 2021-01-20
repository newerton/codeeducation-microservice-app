import {MethodDecoratorFactory} from '@loopback/metadata';
import {Options} from 'amqplib';

export interface RabbitmqSubscribeMetada {
  exchange: string;
  routingKey: string | string[];
  queue?: string;
  queueOptions?: Options.AssertQueue;
}

export const RABBITMQ_SUBSCRIBE_DECORATOR = 'rabbitmq-subscribe-metadata';

export function rabbitmqSubscribe(
  spec: RabbitmqSubscribeMetada,
): MethodDecorator {
  return MethodDecoratorFactory.createDecorator<RabbitmqSubscribeMetada>(
    RABBITMQ_SUBSCRIBE_DECORATOR,
    spec,
  );
}
