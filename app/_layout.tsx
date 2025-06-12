import InitialLauyot from '@/components/InitialLauyot';
import ClerkConvexProvider from '@/provieders/ClerkConvexProvieder';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (    
    <ClerkConvexProvider children={
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <InitialLauyot />
        </SafeAreaView>
      </SafeAreaProvider>
    } />
  );
}
