import React, { useContext, useState } from "react";
import { ActivityIndicator, Alert, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import { useAuth } from "../../hooks/auth";

import { SignInButton } from "../../components/SignInButton";

import { useTheme } from "styled-components";

import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
} from "./styles";

import AppleSvg from '../../assets/Apple.svg';
import GoogleSvg from '../../assets/Google.svg';
import LogoSvg from '../../assets/Logo.svg';

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);

    const { signInWithGoogle, signInWithApple } = useAuth();

    const theme = useTheme();

    async function handleSignInWithGoogle() {
        try {
            setIsLoading(true);
            return await signInWithGoogle();
        } catch (error) {
            console.log(error);
            Alert.alert('Warning', 'Unable to sign in with Google. Please try again.');
            setIsLoading(false);
        }
    }

    async function handleSignInWithApple() {
        try {
            setIsLoading(true);
            return await signInWithApple();
        } catch (error) {
            console.log(error);
            Alert.alert('Warning', 'Unable to sign in with Apple. Please try again.');
            setIsLoading(false);
        }
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(200)}
                        height={RFValue(150)}
                    />

                    <Title>
                        Your finances in {'\n'}
                        a simple and  {'\n'}secure way.
                    </Title>
                </TitleWrapper>

                <SignInTitle>
                    Log in with an account of your choice.
                </SignInTitle>
            </Header>
            <Footer>
                <FooterWrapper>
                    <SignInButton
                        title="Log in with Google account"
                        svg={GoogleSvg}
                        onPress={handleSignInWithGoogle}
                    />

                    {
                        Platform.OS === 'ios' &&
                        <SignInButton
                            title="Log in with Apple account"
                            svg={AppleSvg}
                            onPress={handleSignInWithApple}
                        />
                    }

                </FooterWrapper>

                {
                    isLoading && <ActivityIndicator color={theme.colors.primary} />
                }
            </Footer>
        </Container>
    )
}