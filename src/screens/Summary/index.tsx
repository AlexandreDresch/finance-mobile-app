import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { HistoryCard } from '../../components/HistoryCard';

import { categories } from '../../utils/categories';

import { useAuth } from '../../hooks/auth';

import { useTheme } from 'styled-components';

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer
} from './styles';

interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
};

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percentFormatted: string;
    percent: number;
}

export function Summary() {
    const theme = useTheme();

    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

    const { userData } = useAuth();

    function handleDateChange(action: 'next' | 'previous') {
        if (action === 'next') {
            const newDate = addMonths(selectedDate, 1)
            setSelectedDate(newDate);
        } else {
            const newDate = subMonths(selectedDate, 1)
            setSelectedDate(newDate);
        }
    }

    async function loadData() {
        setIsLoading(true);
        const dataKey = `@finance:transactions_user:${userData.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted
            .filter((expensive: TransactionData) =>
                expensive.type === 'negative' &&
                new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
                new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
            );

        const expensivesTotal = expensives.reduce((accumulator: number, expensive: TransactionData) => {
            return accumulator + +expensive.amount;
        }, 0);

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if (expensive.category === category.key) {
                    categorySum += +expensive.amount;
                }
            });

            if (categorySum > 0) {
                const totalFormatted = categorySum
                    .toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                    });

                const percent = (categorySum / expensivesTotal * 100);
                const percentFormatted = `${percent.toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percentFormatted,
                    percent,
                });
            }
        });

        setTotalByCategories(totalByCategory);
        setIsLoading(false);
    };

    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]))

    return (
        <Container>
            <Header>
                <Title>
                    Summary
                </Title>
            </Header>

            {
                isLoading
                    ?
                    <LoadContainer>
                        <ActivityIndicator color={theme.colors.primary} size='large' />
                    </LoadContainer>
                    :
                    <Content
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: useBottomTabBarHeight()
                        }}
                    >

                        <MonthSelect>
                            <MonthSelectButton onPress={() => handleDateChange('previous')}>
                                <MonthSelectIcon name='chevron-left' />
                            </MonthSelectButton>

                            <Month>
                                {
                                    format(selectedDate, 'yyyy, MMMM').toUpperCase()
                                }
                            </Month>

                            <MonthSelectButton onPress={() => handleDateChange('next')}>
                                <MonthSelectIcon name='chevron-right' />
                            </MonthSelectButton>
                        </MonthSelect>

                        <ChartContainer>
                            <VictoryPie
                                data={totalByCategories}
                                colorScale={totalByCategories.map(category => category.color)}
                                style={{
                                    labels: {
                                        fontSize: RFValue(18),
                                        fontWeight: 'bold',
                                        fill: theme.colors.secondary
                                    }
                                }}
                                labelRadius={50}
                                x='percentFormatted'
                                y='total'
                            />
                        </ChartContainer>

                        {
                            totalByCategories.map(item => (
                                <HistoryCard
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))
                        }
                    </Content>

            }
        </Container>
    )
}