import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import type { AxiosResponse } from 'axios';
import _ from 'lodash';
import { catchError, firstValueFrom, lastValueFrom, map, of } from 'rxjs';

import type { EmptyDto, ResponsesDataDto, ResponsesListDto } from '../../dto';
import { ErrorMessageProvider } from '../../provider/error-message.provider';
import type {
  PassDto,
  PasskeyDto,
  PassModifyDto,
  PassQueryDto,
  PassRegisterDto,
  PassRegisterKeyDto,
  PhoneDto,
} from './dto';

@Injectable()
export class PassService {
  constructor(private readonly httpService: HttpService) {}

  async getPassList(
    propertyId: number,
    params?: PassQueryDto,
  ): Promise<PassDto[]> {
    const passList$ = this.httpService
      .get<ResponsesListDto<PassDto>>(`xxxxxx`, {
        params,
      })
      .pipe(
        map(
          (axiosResponse: AxiosResponse) =>
            axiosResponse.data as ResponsesListDto<PassDto>,
        ),
        catchError((e) => {
          ErrorMessageProvider.httpError(e, PassService.name);
          if (e.response.status === HttpStatus.NOT_FOUND) {
            return of({ data: { list: [] } });
          }
          throw e;
        }),
      );
    const { data } = await lastValueFrom(passList$);
    return data.list;
  }
}
