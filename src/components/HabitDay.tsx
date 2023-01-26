import {
  TouchableOpacity,
  Dimensions,
  TouchableOpacityProps,
} from 'react-native';
import clsx from 'clsx';

import { generateProgressPercent } from '../utils/generate-progress-percentage';
import dayjs from 'dayjs';

const WEEK_DAYS = 7;
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MRGIN_BETWEEN = 8;
export const DAY_SIZE =
  Dimensions.get('screen').width / WEEK_DAYS - (SCREEN_HORIZONTAL_PADDING + 5);

interface HabitDayProps extends TouchableOpacityProps {
  date: Date;
  amountOfHabits?: number;
  amountCompleted?: number;
}

export function HabitDay({
  date,
  amountOfHabits = 0,
  amountCompleted = 0,
  ...rest
}: HabitDayProps) {
  const amountAccomplishedPercentage = amountOfHabits
    ? generateProgressPercent(amountOfHabits, amountCompleted)
    : 0;
  const today = dayjs().startOf('day').toDate();
  const isCurrentDay = dayjs(date).isSame(today);

  return (
    <TouchableOpacity
      className={clsx('rounded-lg border-2 m-1 ', {
        ['bg-zinc-900 border-zinc-800']: amountAccomplishedPercentage === 0,
        ['bg-teal-900 border-teal-800']:
          amountAccomplishedPercentage > 0 && amountAccomplishedPercentage < 20,
        ['bg-teal-800 border-teal-600']:
          amountAccomplishedPercentage >= 20 &&
          amountAccomplishedPercentage < 40,
        ['bg-teal-600 border-teal-500']:
          amountAccomplishedPercentage >= 40 &&
          amountAccomplishedPercentage < 60,
        ['bg-teal-500 border-teal-400']:
          amountAccomplishedPercentage >= 60 &&
          amountAccomplishedPercentage < 80,
        ['bg-teal-400 border-teal-300']: amountAccomplishedPercentage >= 80,
        ['border-white border-2']: isCurrentDay,
      })}
      style={{ width: DAY_SIZE, height: DAY_SIZE }}
      activeOpacity={0.7}
      {...rest}
    />
  );
}
