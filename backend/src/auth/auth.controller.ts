import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  @Get('social-callback')
  async socialCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      // In real implementation, exchange code for tokens with Cognito
      // For demo, redirect based on user status
      
      if (code) {
        // Simulate checking if user has phone number
        const hasPhoneNumber = Math.random() > 0.5;
        
        if (hasPhoneNumber) {
          // Existing user - redirect to chat
          res.redirect('http://localhost:3000/chat');
        } else {
          // New user - complete profile
          res.redirect('http://localhost:3000/auth/complete-profile?name=John Doe&email=john@example.com');
        }
      } else {
        res.redirect('http://localhost:3000/');
      }
    } catch (error) {
      res.redirect('http://localhost:3000/?error=auth_failed');
    }
  }
}