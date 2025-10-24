import { Global, Module } from '@nestjs/common';
import { globalDbPRovider } from './global-db.provider';
import { GlobalDbService } from './global-db.service';

@Global()
@Module({
  providers:[GlobalDbService, ...globalDbPRovider],
  exports:[GlobalDbService]
})
export class GlobalDbModule {}
