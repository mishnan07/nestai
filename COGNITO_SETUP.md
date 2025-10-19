# AWS Cognito Setup Guide

This guide walks you through setting up AWS Cognito for the Digilaw AI application.

## Step 1: Create User Pool

1. Go to AWS Cognito Console
2. Click "Create user pool"
3. Choose "Email" as sign-in option
4. Configure password policy:
   - Minimum length: 8 characters
   - Require uppercase, lowercase, numbers
5. Enable MFA: Optional
6. Configure user account recovery: Email preferred

## Step 2: Configure User Attributes

Required attributes:
- `email` (required, mutable, verified)
- `name` (required, mutable)
- `phone_number` (required, mutable, verified)

Custom attributes (optional):
- `custom:role` (string, mutable)

## Step 3: Configure Message Delivery

### Email Configuration
- Use Cognito default for development
- For production, configure SES

### SMS Configuration
- Use Cognito default for development
- Configure SNS for production

## Step 4: Create App Client

1. App client name: `digilaw-web-client`
2. Generate client secret: **NO**
3. Auth flows:
   - ✅ USER_PASSWORD_AUTH
   - ✅ REFRESH_TOKEN_AUTH
   - ✅ REFRESH_TOKEN
4. Token expiration:
   - Access token: 1 hour
   - ID token: 1 hour
   - Refresh token: 30 days

## Step 5: Configure OAuth

### OAuth 2.0 Settings
- Allowed OAuth flows:
  - ✅ Authorization code grant
- Allowed OAuth scopes:
  - ✅ email
  - ✅ openid
  - ✅ profile

### Callback URLs
```
http://localhost:3000/auth/social-callback
https://yourdomain.com/auth/social-callback
```

### Sign-out URLs
```
http://localhost:3000/
https://yourdomain.com/
```

## Step 6: Configure Identity Providers

### Google OAuth Setup

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   ```
   https://your-cognito-domain.auth.region.amazoncognito.com/oauth2/idpresponse
   ```

4. In Cognito, add Google as identity provider:
   - Client ID: From Google Console
   - Client secret: From Google Console
   - Authorize scope: `profile email openid`

### Attribute Mapping
Map Google attributes to Cognito:
- `email` → `email`
- `name` → `name`
- `given_name` → `given_name`
- `family_name` → `family_name`

## Step 7: Configure Hosted UI (Optional)

1. Domain name: `your-app-name` (creates: your-app-name.auth.region.amazoncognito.com)
2. CSS customization: Upload custom CSS if needed
3. Logo: Upload your app logo

## Step 8: Lambda Triggers (Optional)

### Post Confirmation Trigger
Create Lambda function to save user data to database:

```javascript
exports.handler = async (event) => {
    const { userAttributes, userName } = event.request;
    
    // Save to your database
    await saveUserToDatabase({
        cognitoSub: userName,
        email: userAttributes.email,
        name: userAttributes.name,
        phoneNumber: userAttributes.phone_number
    });
    
    return event;
};
```

## Step 9: Environment Variables

Add these to your application:

### Frontend (.env.local)
```bash
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_REGION=us-east-1
NEXT_PUBLIC_COGNITO_DOMAIN=your-app-name.auth.us-east-1.amazoncognito.com
```

### Backend (.env)
```bash
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 10: Testing

### Test User Pool
1. Create test user via Cognito console
2. Test sign-in flow
3. Verify email/phone verification works

### Test OAuth Flow
1. Test Google sign-in
2. Verify user attributes are mapped correctly
3. Test callback URL handling

## Security Best Practices

1. **Never expose client secret** in frontend code
2. **Use HTTPS** in production
3. **Validate tokens** on backend
4. **Implement proper CORS** settings
5. **Use least privilege** IAM policies
6. **Enable CloudTrail** for audit logging

## Troubleshooting

### Common Issues

1. **Invalid redirect URI**
   - Ensure callback URLs match exactly
   - Check for trailing slashes

2. **Token validation fails**
   - Verify region configuration
   - Check token expiration

3. **OAuth flow errors**
   - Verify Google OAuth setup
   - Check attribute mapping

4. **Phone verification not working**
   - Ensure phone number format is correct (+91xxxxxxxxxx)
   - Check SMS delivery settings

### Debug Tools

1. Use AWS CloudWatch logs
2. Enable Cognito detailed logging
3. Use browser developer tools for frontend debugging
4. Test with Postman for API calls

## Production Considerations

1. **Custom Domain**: Set up custom domain for Cognito
2. **SES Configuration**: Configure Amazon SES for email delivery
3. **SNS Configuration**: Set up SNS for SMS delivery
4. **Monitoring**: Set up CloudWatch alarms
5. **Backup**: Regular backup of user pool configuration