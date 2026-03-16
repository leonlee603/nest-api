import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';
import { AuthType } from '../enums/auth-type.enum';

// This decorator is used to set the authentication type for a controller or a method
export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
