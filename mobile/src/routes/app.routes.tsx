import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Home } from "../screens/Home";
import { Locations } from "../screens/Locations";

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false}}>
      <Screen name="home" component={Home} />
      <Screen name="location" component={Locations} />
    </Navigator>
  )
}