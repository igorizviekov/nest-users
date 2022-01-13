import { IsOptional, IsString } from 'class-validator';

export class FilterUsersDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  limit: number;

  @IsOptional()
  offset: number;
}
