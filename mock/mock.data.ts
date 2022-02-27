import type { PropertyDto } from '../src/module/grms-service/dto/property.dto';
import type { SpaceDetailDto } from '../src/module/grms-service/dto/space-detail.dto';
import type { PassDto } from '../src/module/pass/dto';

export class MockData {
  get passDto(): PassDto {
    return {
      propertyId: 1,
      spaceId: 0,
      passKey: 'PaSsKeY',
      bookingId: 'Y1631241706406',
      language: 'ko',
      checkin: Date.now(),
      checkout: Date.now(),
      expired: true,
      expiredAt: Date.now(),
      activate: true,
      activateAt: Date.now(),
      passKeyShareLimit: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  get propertyDto(): PropertyDto {
    return {
      id: 10_015,
      pmsVendorId: 3,
      pmsVendorPropertyId: 'ENT_YANOLJA_11_12',
      pmsVendorAuthToken:
        '$2y$12$BwsF3.Uw5arzr8bQ3R.VOeA1D0ejSd7eT6TWosmgHMUzQ59XW6aaq',
      pmsVendorApiKey:
        '$2a$12$ObdJ58LNrBPIMiAQw1Xcx./DItd3MgYhLirw5Le8VDfR4oIVjyu8a',
      manufacturer: 'mercury',
      statusInfo: {
        pass: { bypass: 10, expired: 30 },
        elevatorQR: { used: true },
      },
      createdAt: 1_622_166_890_000,
      updatedAt: 1_632_874_597_000,
      pmsVendorName: 'SANHA',
      thingIds: [41, 42, 43, 44],
      buildings: [
        {
          name: '메인동',
          floors: [
            { name: '4층', rooms: ['402호', '403호', '404호', '405호'] },
          ],
        },
      ],
    };
  }

  get spaceDetailDto(): SpaceDetailDto {
    return {
      id: 47,
      propertyId: 10_015,
      spaceType: 'ROOM',
      parentId: 29,
      name: '405호',
      pmsVendorRoomId: '0405',
      statusInfo: {
        pass: {
          used: true,
        },
        checkIn: {
          time: '2021-08-17T06:32:18.000Z',
          foiloNo: '21000960',
          language: 'KOR',
        },
        checkOut: {
          time: '2021-09-29T00:16:37.000Z',
          foiloNo: '21001256',
          language: 'KOR',
        },
      },
      createdAt: 1_622_166_890_000,
      updatedAt: 1_632_874_597_000,
      pmsVendorId: 3,
      pmsVendorPropertyId: 'ENT_YANOLJA_11_12',
      things: [{ thingId: 44, deviceType: 'rcu' }],
    };
  }
}
