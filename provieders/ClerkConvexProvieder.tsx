import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import React from 'react';
import { tokenCache } from '../cache';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL as string);
const publicKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publicKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env"
    );
  }
export default function ClerkConvexProvider({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publicKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
