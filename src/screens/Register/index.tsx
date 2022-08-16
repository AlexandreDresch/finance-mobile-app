import { useState } from 'react';
import { Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

import { InputForm } from '../../components/Forms/InputForm';
import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';

import { useAuth } from '../../hooks/auth';

import { CategorySelect } from '../CategorySelect';

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsContainer
} from './styles';

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup.string().required('Name is required.'),
    amount: Yup.number().typeError('Enter a numeric value.').positive('Enter a positive value.'),
})

export function Register() {

    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Category',
    });

    const { userData } = useAuth();

    const dataKey = `@finance:transactions_user:${userData.id}`;

    const navigation = useNavigation();

    const { control, handleSubmit, formState: { errors}, reset } = useForm({
        resolver: yupResolver(schema),
    });

    function handleTransactionTypeSelect(type: 'positive' | 'negative') {
        setTransactionType(type);
    }

    function handleOpenCategorySelect() {
        setCategoryModalOpen(true);
    }

    function handleCloseCategorySelect() {
        setCategoryModalOpen(false);
    }

    async function handleRegister(form: FormData) {
        if(!transactionType) {
            return alert('Please select a transaction type.');
        }

        if(category.key === 'category') {
            return alert('Please select a category.');
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const data = await AsyncStorage.getItem(dataKey);
            const currentData= data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction
            ];
            
            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Category'
            });

            navigation.navigate('List');

        } catch (error) {
            console.log(error);
            alert('Could not register.');
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>
                        Register
                    </Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name='name'
                            control={control}
                            placeholder='Name'
                            autoCapitalize='sentences'
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />

                        <InputForm
                            name='amount'
                            control={control}
                            placeholder='Value'
                            keyboardType='numeric'
                            error={errors.amount && errors.amount.message}
                        />

                        <TransactionsContainer>
                            <TransactionTypeButton
                                type='up'
                                title='Income'
                                onPress={() => handleTransactionTypeSelect('positive')}
                                isActive={transactionType === 'positive'}
                            />

                            <TransactionTypeButton
                                type='down'
                                title='Outcome'
                                onPress={() => handleTransactionTypeSelect('negative')}
                                isActive={transactionType === 'negative'}
                            />
                        </TransactionsContainer>

                        <CategorySelectButton title={category.name} onPress={handleOpenCategorySelect} />
                    </Fields>

                    <Button
                        title='Send'
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseCategorySelect}
                    />
                </Modal>

            </Container>
        </TouchableWithoutFeedback>
    )
}