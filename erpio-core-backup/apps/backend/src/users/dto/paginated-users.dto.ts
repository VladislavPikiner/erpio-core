import { User } from '@prisma/client';

export class PaginatedUsersDto {
  users: User[];
  totalCount: number;
}
