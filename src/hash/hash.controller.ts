import { Controller, Get } from '@nestjs/common';

@Controller('api/v1/')
export class HashController {
    @Get('vacode')
    getHashCode() {
        const hashCode = '61863b1b3dffea821b8d945031eb529c7f9ec7c616566d561ef26889197f7963';
        return hashCode;
    }
}
