import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom, retry } from 'rxjs';

import type { ConfirmationEventDto } from './dto/confirmation-message.dto';
import type { DeviceEventDto } from './dto/device-event.dto';

/**
 * SmartThings로부터 전달 받는 Message를 관리합니다.
 * dto/message.dto.ts의 MessageType을 참조할 수 있습니다.
 */
@Injectable()
export class SmartSubscriptionThingsService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * CONFIRMATION - Webhook URL 검증 이벤트
   * SmartThings App 등록 시 입력한 targetUrl을 통해 전달됩니다.
   * CONFIRMATION 확인 후에 상태가 PENDING -> CONFIRMED 로 변경됩니다.
   * @param confirmationEventDto
   */
  async confirmWebHook(
    confirmationEventDto: ConfirmationEventDto,
  ): Promise<void> {
    Logger.log(
      `SmartThings Confirmation ${confirmationEventDto.appId} ${confirmationEventDto.confirmationUrl}`,
    );
    const confirm$ = this.httpService
      .get(confirmationEventDto.confirmationUrl)
      .pipe(retry(2));
    await lastValueFrom(confirm$);
  }

  /**
   * DEVICE EVENT
   * Device 상태 변경에 대한 이벤트
   * Subscription 등록이 완료된 이후 Subscription에 해당하는 Device Event가 수신됩니다.
   * @param eventTime
   * @param event
   */
  async deviceEvent(eventTime: string, event: DeviceEventDto): Promise<void> {
    await new Promise((res) => setTimeout(res, 1));
    Logger.log(eventTime, event);
  }
}
