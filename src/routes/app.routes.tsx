import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components';
import { MaterialIcons } from '@expo/vector-icons';

import { Home } from '../screens/Home';
import { Register } from '../screens/Register';
import { Summary } from '../screens/Summary';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
    const theme = useTheme();
    return (
        <Navigator
            screenOptions={
                {
                    "tabBarActiveTintColor": "#171c2c",
                    "tabBarStyle": [
                      {
                        "display": "flex"
                      },
                      null
                    ]
                  }
            }
        >
            <Screen
                name='List'
                component={Home}
                options={{
                    headerShown: false,
                    tabBarIcon: (({ size, color }) => (
                        <MaterialIcons
                            name='format-list-bulleted'
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />

            <Screen
                name='Register'
                component={Register}
                options={{
                    headerShown: false,
                    tabBarIcon: (({ size, color }) => (
                        <MaterialIcons
                            name='attach-money'
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />

            <Screen
                name='Summary'
                component={Summary}
                options={{
                    headerShown: false,
                    tabBarIcon: (({ size, color }) => (
                        <MaterialIcons
                            name='pie-chart'
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />

        </Navigator>
    )
}