/* eslint-disable @typescript-eslint/unbound-method */
import { HttpService } from '@nestjs/axios';
import { HttpStatus } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import * as rxjs from 'rxjs';

import { MockData } from '../../../../mock/mock.data';
import { ResponsesDataDto, ResponsesListDto } from '../../../dto';
import type { PassDto, PasskeyDto } from '../dto';
import { PassModule } from '../pass.module';
import { PassService } from '../pass.service';

const responseMock = (data: unknown) => {
  const response: AxiosResponse = {
    data,
    headers: {},
    config: { url: 'http://localhost:3000/mockUrl' },
    status: 200,
    statusText: 'OK',
  };
  return response;
};

describe('PassService', () => {
  let passService: PassService;
  let httpService: HttpService;
  const testMockData: MockData = new MockData();
  const passDto = testMockData.passDto;
  const propertyDto = testMockData.propertyDto;
  const spaceDetailDto = testMockData.spaceDetailDto;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [PassModule],
      controllers: [],
      providers: [],
    }).compile();

    httpService = app.get<HttpService>(HttpService);
    passService = app.get<PassService>(PassService);
  });

  it('getPassList', async () => {
    const data: ResponsesListDto<PassDto> = new ResponsesListDto([passDto]);
    const response: AxiosResponse = responseMock(data);

    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => rxjs.of(response));

    const params = {
      spaceId: passDto.spaceId.toString(),
      bookingId: passDto.bookingId,
      activate: passDto.activate,
      page: 0,
      size: 10,
    };
    const passDtoList = await passService.getPassList(
      passDto.propertyId,
      params,
    );

    expect(httpService.get).toBeCalledTimes(1);
    expect(httpService.get).toBeCalledWith(
      `properties/${passDto.propertyId}/passes`,
      { params },
    );
    expect(passDtoList.length).toEqual(1);
    expect(passDtoList[0].passKey).toEqual('PaSsKeY');

    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(
        () =>
          new rxjs.Observable((s) =>
            s.error({ response: { status: HttpStatus.NOT_FOUND } }),
          ),
      );

    const passDtoListEmpty = await passService.getPassList(
      passDto.propertyId,
      params,
    );
    expect(passDtoListEmpty).toEqual([]);
  });

  it('getPass', async () => {
    const data: ResponsesDataDto<PassDto> = new ResponsesDataDto(passDto);
    const response = responseMock(data);

    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => rxjs.of(response));
    const result = await passService.getPass(
      passDto.propertyId,
      passDto.bookingId,
    );
    expect(httpService.get).toBeCalledTimes(1);
    expect(httpService.get).toBeCalledWith(
      `properties/${passDto.propertyId}/passes/${passDto.bookingId}`,
    );
    expect(result.propertyId).toEqual(passDto.propertyId);

    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(
        () =>
          new rxjs.Observable((s) =>
            s.error({ response: { status: HttpStatus.NOT_FOUND } }),
          ),
      );

    const resultEmpty = await passService.getPass(
      passDto.propertyId,
      passDto.bookingId,
    );
    expect(resultEmpty).toBeUndefined();
  });

  it('create', async () => {
    const data: ResponsesDataDto<PasskeyDto> = new ResponsesDataDto({
      passKey: 'PassKey',
    });
    const response = responseMock(data);
    jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(() => rxjs.of(response));
    const passRegisterDto = {
      checkin: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      checkout: dayjs().add(3, 'h').format('YYYY-MM-DD HH:mm:ss'),
      bookingId: `${Date.now()}`,
      language: 'ko',
      passKeyShareLimit: 1,
      mobile: '01012341234',
    };

    const result = await passService.create(
      propertyDto.id,
      spaceDetailDto.id,
      passRegisterDto,
    );
    expect(httpService.post).toBeCalledTimes(1);
    expect(httpService.post).toBeCalledWith(
      `properties/${propertyDto.id}/passes`,
      {
        bookingId: passRegisterDto.bookingId,
        checkin: passRegisterDto.checkin,
        checkout: passRegisterDto.checkout,
        language: passRegisterDto.language,
        mobile: passRegisterDto.mobile,
        passKeyShareLimit: passRegisterDto.passKeyShareLimit,
        spaceId: spaceDetailDto.id,
      },
    );
    expect(result).toEqual({ passKey: 'PassKey' });
  });

  it('updatePassInformation', async () => {
    const response = responseMock({});
    jest
      .spyOn(httpService, 'patch')
      .mockImplementationOnce(() => rxjs.of(response));
    await passService.updatePassInformation(1, 'b001', {
      language: 'ko',
      passKeyShareLimit: 1,
      checkin: '2021-11-19 09:44:06',
      checkout: '2021-11-19 12:44:18',
    });

    expect(httpService.patch).toBeCalledTimes(1);
    expect(httpService.patch).toBeCalledWith('properties/1/passes/b001', {
      checkin: '2021-11-19 09:44:06',
      checkout: '2021-11-19 12:44:18',
      language: 'ko',
      passKeyShareLimit: 1,
    });
  });

  it('activePass', async () => {
    const response = responseMock({});
    jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(() => rxjs.of(response));
    await passService.activePass(1, 'b001');

    expect(httpService.post).toBeCalledTimes(1);
    expect(httpService.post).toBeCalledWith(
      'properties/1/passes/b001/activate',
    );
  });

  it('deactivatePass', async () => {
    const response = responseMock({});
    jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(() => rxjs.of(response));
    await passService.deactivatePass(1, 'b001');

    expect(httpService.post).toBeCalledTimes(1);
    expect(httpService.post).toBeCalledWith(
      'properties/1/passes/b001/deactivate',
    );
  });

  it('deactivatePass, 403 Not Found', async () => {
    jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(
        () =>
          new rxjs.Observable((s) =>
            s.error({ response: { status: HttpStatus.NOT_FOUND } }),
          ),
      );
    await passService.deactivatePass(1, 'b001');

    expect(httpService.post).toBeCalledTimes(1);
    expect(httpService.post).toBeCalledWith(
      'properties/1/passes/b001/deactivate',
    );
  });

  it('sendMessage', async () => {
    const response = responseMock({});
    jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(() => rxjs.of(response));
    await passService.sendMessage(1, 'b001', { mobile: '01012341234' });

    expect(httpService.post).toBeCalledTimes(1);
    expect(httpService.post).toBeCalledWith(
      'properties/1/passes/b001/message',
      { mobile: '01012341234' },
    );
  });

  it('resetPassword', async () => {
    const response = responseMock({});
    jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(() => rxjs.of(response));
    await passService.resetPassword(1, 'b001');

    expect(httpService.post).toBeCalledTimes(1);
    expect(httpService.post).toBeCalledWith(
      'properties/1/passes/b001/password/reset',
    );
  });

  it('createKey', async () => {
    const response = responseMock({});
    jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(() => rxjs.of(response));
    await passService.createKey(1, 35, {
      checkin: '2021-11-19 09:44:06',
      checkout: '2021-11-19 12:44:18',
      bookingId: 'b001',
      language: 'ko',
      passKeyShareLimit: 1,
    });

    expect(httpService.post).toBeCalledTimes(1);
    expect(httpService.post).toBeCalledWith('properties/1/passes/key', {
      spaceId: 35,
      checkin: '2021-11-19 09:44:06',
      checkout: '2021-11-19 12:44:18',
      bookingId: 'b001',
      language: 'ko',
      passKeyShareLimit: 1,
    });
  });
});
