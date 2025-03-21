import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PrinterOutlined,
} from '@ant-design/icons';

import { useLanguageContext } from '@/context/LanguageProvider';

import Tooltip from '../Tooltip/Tooltip';
import s from './HandleEventsButtons.module.scss';

type HandleEventsButtonsPropsType = {
  onPreviousEventClick?: () => void;
  onNextEventClick?: () => void;
  onEditClick: () => void;
  setIsPrintModalOpen?: (value: boolean) => void;
  setIsDeleteModalOpen: (value: boolean) => void;
};

const HandleEventsButtons = ({
  onPreviousEventClick,
  onNextEventClick,
  onEditClick,
  setIsPrintModalOpen,
  setIsDeleteModalOpen,
}: HandleEventsButtonsPropsType) => {
  const { translate } = useLanguageContext();

  return (
    <div className={s.buttons_wrapper}>
      {onPreviousEventClick && onNextEventClick && (
        <>
          <Tooltip message={translate('previous')} type="event_details">
            <button
              className={`${s.select_event_button} ${s.button_hover}`}
              onClick={onPreviousEventClick}
            >
              <ArrowUpOutlined />
            </button>
          </Tooltip>

          <Tooltip message={translate('next')} type="event_details">
            <button
              className={`${s.select_event_button} ${s.button_hover}`}
              onClick={onNextEventClick}
            >
              <ArrowDownOutlined />
            </button>
          </Tooltip>
        </>
      )}

      {setIsPrintModalOpen && (
        <Tooltip message={translate('print')} type="event_details">
          <button
            className={`${s.select_event_button} ${s.button_hover}`}
            onClick={() => setIsPrintModalOpen(true)}
          >
            <PrinterOutlined />
          </button>
        </Tooltip>
      )}

      <Tooltip message={translate('edit')} type="event_details">
        <button
          className={`${s.edit_button} ${s.button_hover}`}
          onClick={onEditClick}
        >
          <EditOutlined />
        </button>
      </Tooltip>

      <Tooltip message={translate('delete')} type="event_details">
        <button
          className={`${s.delete_button} ${s.button_hover}`}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <MinusCircleOutlined />
        </button>
      </Tooltip>
    </div>
  );
};

export default HandleEventsButtons;
