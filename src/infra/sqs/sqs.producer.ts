import { Injectable } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { v4 } from 'uuid';

@Injectable()
export class SqsProduce {
  constructor(private readonly sqsService: SqsService) {}

  async sendToQueue(entity: string, input: any) {
    try {
      await this.sqsService.send(String(process.env.AWS_SQS_QUEUE_NAME), {
        id: v4(),
        body: {
          entity,
          data: JSON.stringify(input),
          service: 'user-ms',
          operation: 'I',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
