import { FC } from "react";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";

dayjs.extend(calendar);

interface Props {
  item: any;
  deleteFn: (id: string) => void;
}

export const ListItem: FC<Props> = ({ item, deleteFn }) => {
  return (
    <li
      className="my-4 py-3 sm:py-4 bg-white rounded-lg border shadow-lg sm:p-8 dark:bg-gray-800 dark:border-gray-100"
      key={`list-item-${item.id}`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-gray-900 truncate dark:text-white">
            {item?.text}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {dayjs(item.created).calendar()}
          </p>
        </div>
        <div className="inline-flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          -${item?.amount}
        </div>
        <button
          type="button"
          className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          onClick={() => deleteFn(item.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
};
