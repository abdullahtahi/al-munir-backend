import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Res,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, CurrentUserInfo } from '../../common/decorators/current-user.decorator';
import { ResponseDto } from '../../common/dto/pagination.dto';

@ApiTags('Authentication')
@Controller('auth')
// @UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: any) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(
    @Body() registerDto: any,
  ) {
    return await this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req, @CurrentUser() user: CurrentUserInfo) {
    return await this.authService.profile(req.user);

  }

  @Patch('change-password')
  async changePassword(
    @CurrentUser() user: CurrentUserInfo,
    @Body() changePasswordDto: any,
  ) {
    await this.authService.changePassword(user.id, changePasswordDto);
    return ResponseDto.success(null, 'Password changed successfully');
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: any) {
    const token = await this.authService.generatePasswordResetToken(forgotPasswordDto.email);

    // In production, you would send this token via email
    // For now, we'll return it in the response (NOT RECOMMENDED for production)
    return ResponseDto.success(
      { reset_token: token },
      'Password reset token generated. Check your email.'
    );
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: any) {
    await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    return ResponseDto.success(null, 'Password reset successfully');
  }

  @Post('logout')
  async logout() {
    // In a more sophisticated system, you might want to blacklist the token
    return ResponseDto.success(null, 'Logged out successfully');
  }
}
