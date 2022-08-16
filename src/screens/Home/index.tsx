import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCardsContainer,
    TransactionsContainer,
    Title,
    TransactionsList,
    LogoutButton,
    LoadContainer
} from './styles';

import { useTheme } from 'styled-components';

export interface DataListProps extends TransactionCardProps {
    id: string;
};

interface HighlightProps {
    amount: string;
    lastTransaction?: string;
}

interface HighlightData {
    entries: HighlightProps;
    expensives: HighlightProps;
    total: HighlightProps;
}

export function Home() {

    const theme = useTheme();
    const { signOut, userData } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative'
    ) {
        const collectionFiltered = collection
        .filter(transaction => transaction.type === type);

        if (collectionFiltered.length === 0) {
            return 0
        }

        const lastTransaction = new Date(
            Math.max.apply(Math, collectionFiltered
                .map(transaction => new Date(transaction.date).getTime())))


        return `${lastTransaction.toLocaleString('en-US', { month: 'long'})}, ${lastTransaction.getDate()}`
    }

    async function loadTransactions() {
        const dataKey = `@finance:transactions_user:${userData.id}`;
        const response = await AsyncStorage.getItem(dataKey);

        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {

            if (item.type === 'positive') {
                entriesTotal += Number(item.amount);
            } else {
                expensiveTotal += Number(item.amount);
            }

            const amount = Number(item.amount).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
            });

            const date = Intl.DateTimeFormat('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date))

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }
        })

        setTransactions(transactionsFormatted);

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionExpenses = getLastTransactionDate(transactions, 'negative');

        const total = entriesTotal - expensiveTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }),
                lastTransaction: lastTransactionEntries === 0 ? 'No transactions yet' : `Last entry on ${lastTransactionEntries}`,
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }),
                lastTransaction: lastTransactionExpenses === 0 ? 'No transactions yet' :`Last expense on ${lastTransactionExpenses}`,
            },
            total: {
                amount: total.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }),
            }
        })
        setIsLoading(false);
    }

    useEffect(() => {
        loadTransactions();

    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    return (
        <Container>
            {
                isLoading
                    ?
                    <LoadContainer>
                        <ActivityIndicator color={theme.colors.primary} size='large' />
                    </LoadContainer>
                    :
                    <>
                        <Header>
                            <UserWrapper>
                                <UserInfo>
                                    <Photo
                                        source={{ uri: userData.photo }}
                                    />
                                    <User>
                                        <UserGreeting>Hello, </UserGreeting>
                                        <UserName>{userData.name}</UserName>
                                    </User>
                                </UserInfo>

                                <LogoutButton onPress={signOut}>
                                    <Icon name='power' />
                                </LogoutButton>
                            </UserWrapper>
                        </Header>

                        <HighlightCardsContainer>
                            <HighlightCard
                                title='Income'
                                amount={highlightData.entries.amount}
                                lastTransaction={highlightData.entries.lastTransaction}
                                type='up'
                            />
                            <HighlightCard
                                title='Outcome'
                                amount={highlightData.expensives.amount}
                                lastTransaction={highlightData.expensives.lastTransaction}
                                type='down'
                            />
                            <HighlightCard
                                title='Total'
                                amount={highlightData.total.amount}
                                type='total'
                            />
                        </HighlightCardsContainer>

                        <TransactionsContainer>
                            <Title>
                                List
                            </Title>

                            <TransactionsList
                                data={transactions}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <TransactionCard data={item} />}
                            />
                        </TransactionsContainer>
                    </>
            }

        </Container>
    );
}