import { PartialType } from '@nestjs/swagger';
import { CreateDependOnDto } from './create-depend-on.dto';

export class UpdateDependOnDto extends PartialType(CreateDependOnDto) {}
