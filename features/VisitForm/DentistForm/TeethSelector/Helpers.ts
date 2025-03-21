import { MappingWithStringKeysType } from '@/types';

const teethNaming: MappingWithStringKeysType = {
  '1': 'central_incisor',
  '2': 'lateral_incisor',
  '3': 'cuspid',
  '4': 'first_bicuspid',
  '5': 'second_bicuspid',
  '6': 'first_molar',
  '7': 'second_molar',
  '8': 'third_molar',
};

const teethPosition: MappingWithStringKeysType = {
  '1': 'upper_left',
  '2': 'upper_right',
  '3': 'lower_right',
  '4': 'lower_left',
};

export const getToothName = (
  tooth: string | null
): { position: string; name: string } | undefined => {
  let result = undefined;

  if (tooth && tooth.length === 2) {
    const position = tooth[0];
    const number = tooth[1];

    result = {
      position: teethPosition[position],
      name: teethNaming[number],
    };
  }

  return result;
};
