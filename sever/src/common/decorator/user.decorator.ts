import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    console.log('data :>> ', data);
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export { CurrentUser };
