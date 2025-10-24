import { SetMetadata } from '@nestjs/common';

export const HasPermission = (permissions: string[], match: string) => {
  return SetMetadata('checkPermissions', { permissions, match });
};
