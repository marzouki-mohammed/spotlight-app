import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function InitialLauyot() {
  const {isLoaded , isSignedIn}=useAuth();
  const segments = useSegments();
  const rout = useRouter();
  useEffect(()=>{
    if(!isLoaded) return;
     const inAuthScreen = segments[0] === "(auth)";

     if(!isSignedIn && !inAuthScreen) rout.replace("/(auth)/login")
     else if(isSignedIn && inAuthScreen) rout.replace("/(tabs)")

  },[isLoaded , isSignedIn , segments])

  if(!isLoaded) return null

  return <Stack screenOptions={{headerShown : false}} />
}