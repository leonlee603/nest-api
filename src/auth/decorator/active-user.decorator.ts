import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { REQUEST_USER_KEY } from '../constants/auth.constants';
import type { ActiveUserData } from '../interfaces/active-user-data.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request[REQUEST_USER_KEY] as ActiveUserData;
    return field ? user[field] : user;
  },
);
