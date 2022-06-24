import { ConflictException, Logger } from '@nestjs/common';
import type { CustomTransportStrategy } from '@nestjs/microservices';
import { Server } from '@nestjs/microservices';
import AWS from 'aws-sdk';
import rTracer from 'cls-rtracer';
import { isObservable, lastValueFrom } from 'rxjs';
import type { ConsumerOptions, SQSMessage } from 'sqs-consumer';
import { Consumer } from 'sqs-consumer';
import { inspect } from 'util';

import { LogType } from '../../constant/log-types';
import { SqsValidationError } from '../../exception/validation.error';
import { ErrorMessageProvider } from '../../provider/error-message.provider';

type IConsumerOptions = Omit<
  ConsumerOptions,
  'queueUrl' | 'handleMessage' | 'handleMessageBatch'
> & {
  endpoint: string;
  queueName: string;
  region: string;
  apiVersion: string;
  maximumRetries: number;
};

export interface ISqsMessageAbstractDto {
  event: string;
  opts: unknown;
  attributes?: AWS.SQS.MessageSystemAttributeMap;
}

export class AwsSqsServer extends Server implements CustomTransportStrategy {
  private consumer: Consumer;
  private maximumRetries: number;
  private onProcessing = 0;

  constructor(protected readonly options: IConsumerOptions) {
    super();
  }

  listen(callback: () => void): void {
    this.createClient();
    callback();
  }

  public async close(): Promise<void> {
    this.consumer.stop();
    await Promise.race([this.sleep(540_000), await this.closeApplication()]);
    Logger.warn('Closed Application', 'END');
  }

  protected async closeApplication(): Promise<void> {
    while (this.onProcessing > 1) {
      await this.sleep(100);
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private createClient(): void {
    const {
      endpoint,
      queueName,
      region,
      apiVersion,
      maximumRetries,
      ...options
    } = this.options;

    this.maximumRetries = maximumRetries ?? 1;

    AWS.config.update({ region });

    const sqs = new AWS.SQS({
      region,
      apiVersion,
      maxRetries: 2,
      httpOptions: {
        connectTimeout: 2000,
        timeout: 120_000,
      },
    });

    this.consumer = Consumer.create({
      ...options,
      sqs,
      queueUrl: `${endpoint}/${queueName}`,
      handleMessage: this.handleMessage.bind(this),
    });

    /**
     * Events {
        'response_processed': [];
        'empty': [];
        'message_received': [SQSMessage];
        'message_processed': [SQSMessage];
        'error': [Error, void | SQSMessage | SQSMessage[]];
        'timeout_error': [Error, SQSMessage];
        'processing_error': [Error, SQSMessage];
        'stopped': [];
      }
     */
    this.consumer.on('error', (_err, msg) => {
      const message = Array.isArray(msg) ? msg[0] : msg;
      if (!message) {
        return;
      }
      const body: ISqsMessageAbstractDto = this.getMessageBody(message);
      ErrorMessageProvider.awsSqsException(
        new ConflictException(body.event),
        message,
        {
          event: 'error',
          queue: queueName,
        },
      );
    });

    this.consumer.on('processing_error', (_err, message) => {
      const body: ISqsMessageAbstractDto = this.getMessageBody(message);
      ErrorMessageProvider.awsSqsException(
        new ConflictException(body.event),
        message,
        {
          event: 'processing_error',
          queue: queueName,
        },
      );
    });

    this.consumer.on('timeout_error', (_err, message) => {
      const body: ISqsMessageAbstractDto = this.getMessageBody(message);
      ErrorMessageProvider.awsSqsException(
        new ConflictException(body.event),
        message,
        {
          event: 'timeout_error',
          queue: queueName,
        },
      );
    });

    this.consumer.on('stopped', () => {
      Logger.warn('SQS Consumer Stopped.', AwsSqsServer.name);
    });

    this.consumer.start();
  }

  private async handleMessage(message: SQSMessage): Promise<void> {
    await rTracer.runWithId(
      async () => this.process(message),
      message.MessageId,
    );
  }

  private async process(message: SQSMessage): Promise<void> {
    Logger.debug(message, [LogType.SQS, 'Received'].join(' '));
    const body: ISqsMessageAbstractDto = this.getMessageBody(message);

    if (+message.Attributes?.ApproximateReceiveCount > this.maximumRetries) {
      ErrorMessageProvider.awsSqsException(
        new ConflictException(
          `The number of retries has been exceeded (${
            body.event ?? 'SyntaxError'
          })`,
        ),
        message,
      );
      return;
    }
    body.attributes = message.Attributes;
    Logger.log(
      `Received Message ${body.event} [${message.MessageId} (${message.Attributes?.ApproximateReceiveCount})]`,
      LogType.SQS,
    );
    const handler = this.getHandlerByPattern(body.event);

    if (!handler) {
      ErrorMessageProvider.awsSqsException(
        new ConflictException('Invalid Event'),
        message,
      );
      return;
    }

    this.onProcessing++;

    try {
      const resultOrStream = await handler(body);
      if (isObservable(resultOrStream)) {
        await lastValueFrom(resultOrStream);
      }
    } catch (error) {
      if (error === SqsValidationError.name) {
        Logger.debug('Ignore Validation Error Message', AwsSqsServer.name);
        return;
      }
      Logger.warn(
        `Detect the error and let SQS reprocess it ${inspect(error, {
          breakLength: Number.POSITIVE_INFINITY,
        })}`,
      );
      throw error;
    } finally {
      this.onProcessing--;
    }
  }

  private getMessageBody(message: SQSMessage): ISqsMessageAbstractDto {
    try {
      const body = JSON.parse(message.Body);
      return body;
    } catch {
      Logger.warn(message.Body, 'SyntaxError');
      return { event: '', opts: {} };
    }
  }
}
