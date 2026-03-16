import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from '../../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../../constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  // All endpoints are protected by default.
  // Need to add Auth decorator with AuthType.NONE to the endpoint to make it public
  private static readonly defaultAuthType = AuthType.BEARER;
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  >;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.BEARER]: this.accessTokenGuard,
      [AuthType.NONE]: {
        canActivate: () => true,
      },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    for (const guard of guards) {
      const result = await guard.canActivate(context);
      if (result) {
        return true;
      }
    }
    return false;
  }
}
