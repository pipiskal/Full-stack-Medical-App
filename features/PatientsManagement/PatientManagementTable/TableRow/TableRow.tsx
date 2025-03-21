import { useRouter } from 'next/navigation';

import { PatientType } from '@/types';

import s from './TableRow.module.scss';
type TableRowPropsType = {
  p: PatientType;
  isSelected: boolean;
};

const TableRow = ({ p, isSelected }: TableRowPropsType): JSX.Element => {
  const { push } = useRouter();

  return (
    <tr
      className={`${s.row} ${isSelected ? s.is_selected : ''}`}
      onClick={() => push(`patients_management?patient=${p._id}`)}
    >
      {/* <td className={s.first_body_column}>{p.amka}</td> */}
      <td className={s.first_body_column}>1111111111111</td>
      <td className={s.second_body_column}>{p.firstName}</td>
      <td className={s.body_column}>{p.lastName}</td>
      <td className={s.last_body_column}>{p.phoneNumber}</td>
    </tr>
  );
};

export default TableRow;
