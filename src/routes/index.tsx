import { NavigationContainer } from "@react-navigation/native";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";

import { useAuth } from "../hooks/auth";

export function Routes() {
    const { userData } = useAuth();

    return (
        <NavigationContainer>
            {userData.id ? <AppRoutes /> : <AuthRoutes />}
        </NavigationContainer>
    )
}