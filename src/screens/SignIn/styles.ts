import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
`;

export const Header = styled.View`
    width: 100%;
    height: 70%;

    background-color: ${({ theme }) => theme.colors.primary};

    justify-content: flex-end;
    align-items: center;
`;

export const TitleWrapper = styled.View`
    align-items: center;
`; 

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    color: ${({ theme }) => theme.colors.title};
    font-size: ${RFValue(20)}px;

    text-align: center;

    margin-top: 45px;
`;

export const SignInTitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    color: ${({ theme }) => theme.colors.text_secondary};
    font-size: ${RFValue(15)}px;

    text-align: center;

    margin-top: 80px;
    margin-bottom: 67px;
`;

export const Footer = styled.View`
    width: 100%;
    height: 30%;

    background-color: ${({ theme }) => theme.colors.secondary};
`;

export const FooterWrapper = styled.View`
    margin-top: ${RFPercentage(7)}px;
    padding: 0 32px;

    justify-content: space-between;
`;
