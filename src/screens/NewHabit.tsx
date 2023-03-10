import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

import { BackButton } from '../components/BackButton';
import { Checkbox } from '../components/Checkbox';
import { api } from '../lib/axios';

const weekDaysNames = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

export function NewHabit() {
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [title, setTitle] = useState('');

  function handleToggleWeekDay(weekDayIndex: number) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays(prevState =>
        prevState.filter(weekDay => weekDay !== weekDayIndex)
      );
    } else {
      setWeekDays(prevState => [...prevState, weekDayIndex]);
    }
  }

  async function handleCreateNewHabit() {
    try {
      if (!title.trim() || weekDays.length === 0)
        return Alert.alert(
          'Novo hábito',
          'Informe o nome do hábito e escolha sua periodicidade!'
        );

      await api.post('/habits', { title, weekDays });

      setTitle('');
      setWeekDays([]);
      Alert.alert('Novo hábito', 'Hábito cadastrado com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Ops...', 'Não foi possível criar o novo hábito');
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-white font-bold text-3xl">Criar hábito</Text>
        <Text className="mt-6 text-white font-semibold text-base">
          Qual é a sua meta?
        </Text>
        <TextInput
          placeholder="ex.: fazer exercícios, dormir o suficiente..."
          placeholderTextColor={colors.zinc[400]}
          onChangeText={setTitle}
          value={title}
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-teal-600"
        />

        <Text className="mt-4 mb-3 text-white font-semibold text-base">
          Em quais dias da semana?
        </Text>
        {weekDaysNames.map((day, index) => (
          <Checkbox
            key={index}
            title={day}
            checked={weekDays.includes(index)}
            onPress={() => handleToggleWeekDay(index)}
          />
        ))}
        <TouchableOpacity
          onPress={handleCreateNewHabit}
          className="w-full h-14 mt-3 rounded-lg flex-row items-center justify-center bg-teal-600"
          activeOpacity={0.7}
        >
          <Feather name="check" size={20} color={colors.white} />
          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
