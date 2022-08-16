import { RectButtonProps } from 'react-native-gesture-handler';

import {
    Container,
    Icon,
    Title,
    Button
} from './styles';

const icons = {
    up: 'arrow-up',
    down: 'arrow-down'
}

interface Props extends RectButtonProps {
    title: string;
    type: 'up' | 'down';
    isActive: boolean;
}

export function TransactionTypeButton({ title, type, isActive, ...rest }: Props) {
    return (
        <Container 
            isActive={isActive}
            type={type}
        >
            <Button {...rest}>
            <Icon name={icons[type]} type={type}/>
            <Title>
                {title}
            </Title>
            </Button>
        </Container>
    )
}