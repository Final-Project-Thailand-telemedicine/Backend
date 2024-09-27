import { UseGuards, applyDecorators } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"
import { AccessTokenGuard } from "src/common/guards/access-token.guard"

export const Auth = (...args: string[]) => {
    return applyDecorators(
        ApiBearerAuth(),
        UseGuards(AccessTokenGuard)
    )
}
