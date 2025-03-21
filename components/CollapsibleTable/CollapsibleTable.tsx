import { DeleteOutlined, RightOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

import s from './CollapsibleTable.module.scss';

type DataType = {
  title: string;
  description: string;
  headerIcons?: React.ReactNode;
  content?: React.ReactNode;
};

type CollapsibleTablePropsType = {
  data: DataType[] | undefined;
  isReadOnly?: boolean;
  triggerExpand: number;
  onDeleteItem?: (item: string) => void;
};

const CollapsibleTable = ({
  data,
  isReadOnly,
  onDeleteItem,
  triggerExpand,
}: CollapsibleTablePropsType) => {
  const [expandedItem, setExpandedItem] = useState<DataType | null>(
    data?.[data.length - 1] || null
  );

  useEffect(() => {
    setExpandedItem(data?.[data.length - 1] || null);
  }, [triggerExpand]);

  const handleExpand = (item: DataType) => {
    if (expandedItem?.title === item.title) {
      setExpandedItem(null);
    } else {
      setExpandedItem(item);
    }
  };

  return (
    <div security={s.table_wrapper}>
      {data?.map((item: DataType, index: number) => (
        <div
          key={item.title}
          className={`${
            index === data.length - 1 && expandedItem?.title === item.title
              ? s.item_last_open
              : ''
          } ${s.table_element}`}
        >
          <div className={s.header}>
            <button
              type="button"
              onClick={() => handleExpand(item)}
              className={`${s.element_header} ${
                s[
                  !isReadOnly && expandedItem?.title === item.title
                    ? 'no_bottom_radius'
                    : ''
                ]
              }
            ${
              s[
                !isReadOnly && expandedItem?.title === item.title
                  ? 'element_header_active'
                  : ''
              ]
            }`}
            >
              {!isReadOnly && (
                <RightOutlined
                  className={
                    s[
                      expandedItem?.title === item.title
                        ? 'arrow_down'
                        : 'arrow'
                    ]
                  }
                />
              )}
              <span className={s.item_title}>{item.title}</span>

              <span className={s.item_description}>{item.description}</span>
            </button>
            {!isReadOnly && expandedItem?.title === item.title && (
              <button
                type="button"
                className={s.delete_button}
                onClick={() => onDeleteItem?.(item.title)}
              >
                <DeleteOutlined />
              </button>
            )}
          </div>

          <div
            className={`${isReadOnly && s.element_content_visible} ${
              !isReadOnly && expandedItem?.title === item.title
                ? s.element_content_visible
                : s.element_content_hidden
            }`}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollapsibleTable;
