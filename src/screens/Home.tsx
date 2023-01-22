import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { api } from '../lib/axios';
import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning';

import { HabitDay, DAY_SIZE } from '../components/HabitDay';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import dayjs from 'dayjs';

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const datesFromYearStart = generateDatesFromYearBeginning();
const minimumSummaryDateSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDateSizes - datesFromYearStart.length;

type Summary = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>;

export function Home() {
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      const { data } = await api.get('/summary');
      setSummary(data);
    } catch (error) {
      console.error(JSON.stringify(error));
      Alert.alert('Ops...', 'Could not load habits summary');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, index) => {
          return (
            <Text
              key={index}
              className="text-zinc-400 text-xl font-bold text-center mx-1"
              style={{ width: DAY_SIZE }}
            >
              {weekDay}
            </Text>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {summary &&
            datesFromYearStart.map(date => {
              const dayWithHabits = summary.find(day =>
                dayjs(date).isSame(day.date)
              );

              return (
                <HabitDay
                  key={date.toISOString()}
                  date={date}
                  amountOfHabits={dayWithHabits?.amount}
                  amountCompleted={dayWithHabits?.completed}
                  onPress={() =>
                    navigate('habit', { date: date.toISOString() })
                  }
                />
              );
            })}
          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, index) => (
              <View
                key={index}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
