import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { View } from 'react-native';
import '../global.css';

// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const [isInitialized, setIsInitialized] = useState(false);

  // const [loaded] =
  useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  // useEffect(() => {
  //   if (isInitialized && loaded) {
  //     SplashScreen.hideAsync().catch(() => {});
  //   }
  // }, [isInitialized, loaded]);

  return (
    <ThemeProvider value={DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="dark" />
      </View>
    </ThemeProvider>
  );
}
