import { ApiProperty } from '@nestjs/swagger';

export class DeviceEventDto {
  @ApiProperty({
    type: String,
    description: 'Event ID',
    example: 'e49f0bcb-1448-11e9-9b5f-b1b938305cfe',
  })
  eventId: string;

  @ApiProperty({
    type: String,
    description: 'Location ID',
    example: 'd172054e-fee1-4f8f-acb1-cfd0acea5355',
  })
  locationId: string;

  @ApiProperty({
    type: String,
    description: 'Device ID',
    example: 'a35d7f6c-1ecf-4bbc-8fa4-ec9b2a71351c',
  })
  deviceId: string;

  @ApiProperty({
    type: String,
    description: 'Component ID',
    example: 'main',
  })
  componentId: string;

  @ApiProperty({
    type: String,
    description: 'capability',
    example: 'switch',
  })
  capability: string;

  @ApiProperty({
    type: String,
    description: 'Attribute',
    example: 'switch',
  })
  attribute: string;

  @ApiProperty({
    description: 'Value, type be defined by valueType',
    example: ['on', 5, 5.5, true, { x: 12, y: 24 }, ['heat', 'cool']],
  })
  value: unknown;

  @ApiProperty({
    type: String,
    description: 'Value Type',
    examples: ['string', 'integer', 'number', 'object', 'array', 'boolean'],
  })
  valueType: string;

  @ApiProperty({
    type: Boolean,
    description: 'is state has changed',
    example: true,
  })
  stateChange: boolean;

  @ApiProperty({
    type: String,
    description: 'Subscription Name',
    example: '0c45cf8e-b725-4c5e-9f4f-3613b9744029',
  })
  subscriptionName: string;
}
