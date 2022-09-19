import { Controller, Logger, UseFilters, UsePipes } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { Events } from '../../constant/events';
import { SqsExceptionFilter } from '../../filter/sqs-exception.filter';
import { AwsSqsValidationPipe } from '../../pipe/aws-sqs-validation.pipe';

@Controller()
@UsePipes(new AwsSqsValidationPipe())
@UseFilters(new SqsExceptionFilter())
export class SqsEventController {
  constructor() {}

  @MessagePattern(Events.UPDATED_CHECK_IN)
  async updatedCheckIn(
    updatedCheckInEventDto: UpdatedCheckInEventDto,
  ): Promise<void> {
    Logger.log(updatedCheckInEventDto);
  }

}
