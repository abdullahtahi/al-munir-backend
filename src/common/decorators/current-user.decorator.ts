import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserInfo {
  id: number;
  email: string;
  role: string;
  level: number;
  status: string;
}

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext): CurrentUserInfo => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
