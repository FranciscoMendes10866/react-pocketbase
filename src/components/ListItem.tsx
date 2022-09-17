import { FC, useCallback } from "react";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import { mutate } from "swr";
import classNames from "classnames";

import { pocketbase } from "../utils/pocketbase";

dayjs.extend(calendar);

interface Props {
  item: any;
  deleteFn: (id: string) => void;
}

export const ListItem: FC<Props> = ({ item, deleteFn }) => {
  const handleProtectionState = useCallback(async (item: any) => {
    await pocketbase.records.update("expenses", item.id, {
      isProtected: !item.isProtected,
    });
    mutate("getExpenses/");
  }, []);

  return (
    <li className="my-4 py-3 sm:py-4 bg-white rounded-lg border shadow-lg p-4 dark:bg-gray-800 dark:border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-gray-900 truncate dark:text-white">
            {item?.expenseName}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {dayjs(item.created).calendar()}
          </p>
        </div>
        <div className="inline-flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          -${item?.amount}
        </div>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className="rounded-l-md text-white bg-violet-500 hover:bg-violet-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium text-sm p-2 text-center inline-flex items-center dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800"
            onClick={() => handleProtectionState(item)}
          >
            {item.isProtected ? "Unlock" : "Lock"}
          </button>
          <button
            type="button"
            className={classNames([
              "rounded-r-md text-white focus:ring-4 focus:outline-none font-medium text-sm p-2 text-center inline-flex items-center",
              item.isProtected
                ? "bg-gray-500 hover:bg-gray-600 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                : "bg-rose-500 hover:bg-rose-600 focus:ring-rose-300 dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800",
            ])}
            onClick={() => deleteFn(item.id)}
            disabled={item.isProtected}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};
