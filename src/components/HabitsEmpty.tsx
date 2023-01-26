import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';

export function HabitsEmpty() {
  const { navigate } = useNavigation();

  return (
    <>
      <Text className="text-zinc-400 text-base">
        Não há hábitos cadastrados para hoje!
      </Text>
      <Text
        className="text-teal-400 text-base active:text-teal-500"
        onPress={() => navigate('newHabit')}
      >
        → comece um novo hábito
      </Text>
    </>
  );
}
