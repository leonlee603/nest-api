import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreateMetaOptionDto {
  // The value of the meta option, which is a serialized JSON object
  @ApiProperty({
    description: 'The value of the meta option',
    example: '{"key": "value"}',
  })
  @IsJSON()
  @IsNotEmpty()
  metaValue: string;
}
