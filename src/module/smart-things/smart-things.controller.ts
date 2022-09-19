import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { EventType } from './dto/event.dto';
import { MessageDto, MessageType } from './dto/message.dto';
import { SmartSubscriptionThingsService } from './smart-things.subscription.service';

@Controller('smart-things')
@ApiTags('SmartThings')
export class SmartThingsController {
  constructor(
    private readonly smartSubscriptionThingsService: SmartSubscriptionThingsService,
  ) {}

  @Post('subscribe')
  @ApiOperation({
    summary: 'receive subscription events',
    description: 'SmartThings로부터 이벤트를 전달받아 처리한다.',
  })
  async subscribeEvents(@Body() messageDto: MessageDto): Promise<unknown> {
    if (messageDto.lifecycle === MessageType.CONFIRMATION) {
      /**
       * SmartThings에 응답을 보내지 않으면 403이 발생되기 떄문에,
       * Response 201 OK 이후 1초 후에 Confirm URL을 처리하기위해 1초 뒤에 처리되도록 하였다.
       * Queue를 사용하는 환경이라면 setTimeout보다 Queue를 통해 Delay이후 처리하는 것이 안정적이다.
       */
      setTimeout(
        () =>
          void this.smartSubscriptionThingsService.confirmWebHook(
            messageDto.confirmationData,
          ),
        1000,
      );
    }
    if (messageDto.lifecycle === MessageType.EVENT) {
      // TODO: check
      await Promise.all(
        (messageDto.eventData?.events ?? [])
          .filter((e) => e.eventType === EventType.DEVICE_EVENT)
          .map((event) =>
            this.smartSubscriptionThingsService.deviceEvent(
              event.eventTime,
              event.deviceEvent,
            ),
          ),
      );
      return {
        eventData: {},
      };
    }
    Logger.log(messageDto, 'unknown smart-things event');
  }

  @Get('oauth/callback')
  @ApiOperation({
    summary: 'oAuth authorize code',
    description: 'SmartThings로부터 code를 획득하기 위한 redirect url',
  })
  oAuthAuthorizeCode(@Query('code') code: string): string {
    return code;
  }
}
