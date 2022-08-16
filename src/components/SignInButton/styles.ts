import { RectButton } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";

export const Button = styled(RectButton)`
    height: ${RFValue(56)}px;

    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 5px;

    align-items: center;
    flex-direction: row;

    margin-bottom: 16px;
`; 

export const ImageContainer = styled.View`
    height: 100%;
    justify-content: center;
    align-items: center;

    padding: ${RFValue(10)}px;
    border-color: ${({ theme }) => theme.colors.tertiary};
    border-right-width: 1px;
`; 

export const Text = styled.Text`
    flex: 1;
    text-align: center;

    font-family: ${({ theme }) => theme.fonts.medium};
    color: ${({ theme }) => theme.colors.secondary};
    font-size: ${RFValue(14)}px;
`;
