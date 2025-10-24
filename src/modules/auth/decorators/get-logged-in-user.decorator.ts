import { Consultant } from '@/modules/consultant/consultant.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetLoggedInUser = createParamDecorator(
  (data, ctx: ExecutionContext): Consultant => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
