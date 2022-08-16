import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthProviderProps {
    children: ReactNode;
};

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface IAuthContextData {
    userData: User;
    signInWithGoogle(): Promise<void>;
    signInWithApple(): Promise<void>;
    signOut(): Promise<void>;
    userStorageLoading: boolean;
};

interface AuthResponse {
    params: {
        access_token: string;
    };
    type: string;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {

    const [ userData, setUserData ] = useState<User>({} as User)
    const [ userStorageLoading, setUserStorageLoading ] = useState(true)

    const userStorageKey = '@finances:user';

    async function signInWithGoogle() {
        try {
            const CLIENT_ID = '';
            const REDIRECT_URI = '';
            const SCOPE = encodeURI('profile email');
            const RESPONSE_TYPE = 'token';

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
            
            const { type, params } = await AuthSession.startAsync({ authUrl }) as AuthResponse;

            if(type === 'success') {
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
                const user = await response.json();                
                console.log(user);

                const userLogged = {
                    id: user.id,
                    email: user.email!,
                    name: user.name!,
                    photo: user.picture!,
                };

                setUserData(userLogged);

                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
            }

        } catch (error) {
            console.log(error);
        }
    }

    async function signInWithApple() {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            })

            if(credential) {
                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!,
                    name: credential.fullName!.givenName!,
                    photo: `https://ui-avatars.com/api/?name=${credential.fullName!.givenName!}&length=1`,
                };

                setUserData(userLogged);

                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
            }            

        } catch (error) {
            throw new Error(error);
        }
    }

    async function signOut() {
        setUserData({} as User);
        await AsyncStorage.removeItem(userStorageKey);
    }

    useEffect(() => {
        async function loadStorageData() {
            const userStored = await AsyncStorage.getItem(userStorageKey);

            if(userStored) {
                const userLogged = JSON.parse(userStored) as User;
                setUserData(userLogged);
            }

            setUserStorageLoading(false);
        }

        loadStorageData();
    }, [])

    return (
        <AuthContext.Provider value={{ userData, signInWithGoogle, signInWithApple, signOut, userStorageLoading }}>
          {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext)

    return context;
}

export { AuthProvider, useAuth}