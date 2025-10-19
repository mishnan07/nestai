import { Amplify } from 'aws-amplify';
import { signUp, signIn, confirmSignUp, signOut, getCurrentUser } from 'aws-amplify/auth';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      loginWith: {
        email: true,
      },
    }
  }
};

Amplify.configure(amplifyConfig);

export const cognitoAuth = {
  signUp: async (phone: string, password: string, name: string) => {
    return await signUp({
      username: `${phone}@digilaw.temp`,
      password,
      options: {
        userAttributes: {
          name,
          phone_number: `+91${phone}`,
          email: `${phone}@digilaw.temp`,
        },
      },
    });
  },

  confirmSignUp: async (phone: string, code: string) => {
    return await confirmSignUp({
      username: `${phone}@digilaw.temp`,
      confirmationCode: code,
    });
  },

  signIn: async (emailOrPhone: string, password: string) => {
    const username = emailOrPhone.includes('@') 
      ? emailOrPhone 
      : `${emailOrPhone}@digilaw.temp`;
    
    return await signIn({
      username,
      password,
    });
  },

  signOut: async () => {
    return await signOut();
  },

  getCurrentUser: async () => {
    return await getCurrentUser();
  },
};