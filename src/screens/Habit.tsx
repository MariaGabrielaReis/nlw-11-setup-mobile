import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import clsx from 'clsx';

import { api } from '../lib/axios';
import { generateProgressPercent } from '../utils/generate-progress-percentage';

import { BackButton } from '../components/BackButton';
import { ProgressBar } from '../components/ProgressBar';
import { Checkbox } from '../components/Checkbox';
import { Loading } from '../components/Loading';
import { HabitsEmpty } from '../components/HabitsEmpty';

interface Params {
  date: string;
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: { id: string; title: string }[];
}

export function Habit() {
  const route = useRoute();
  const { date } = route.params as Params;
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

  const dayProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercent(
        dayInfo.possibleHabits.length,
        completedHabits.length
      )
    : 0;

  async function fetchHabits() {
    try {
      setLoading(true);
      const { data } = await api.get('/day', { params: { date } });
      setDayInfo(data);
      setCompletedHabits(data.completedHabits);
    } catch (error) {
      console.error(error);
      Alert.alert('Ops...', ' Não foi possível listar os hábitos');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    if (completedHabits.includes(habitId)) {
      setCompletedHabits(prevState =>
        prevState.filter(habit => habit !== habitId)
      );
    } else {
      setCompletedHabits(prevState => [...prevState, habitId]);
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) return <Loading />;

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white font-bold text-3xl">{dayAndMonth}</Text>

        <ProgressBar progress={dayProgress} />

        <View
          className={clsx('mt-6', {
            ['opacity-50']: isDateInPast,
          })}
        >
          {dayInfo?.possibleHabits ? (
            dayInfo.possibleHabits.map(habit => (
              <Checkbox
                key={habit.id}
                title={habit.title}
                checked={completedHabits.includes(habit.id)}
                disabled={isDateInPast}
                onPress={() => handleToggleHabit(habit.id)}
              />
            ))
          ) : (
            <HabitsEmpty />
          )}
        </View>

        {isDateInPast && (
          <Text className="text-white mt-10 text-center">
            OBS.: Não é possível editar hábitos de uma data passada!
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
