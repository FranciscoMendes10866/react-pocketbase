import { useFormik } from "formik";
import { useCallback, useMemo } from "react";
import * as yup from "yup";
import useSWR from "swr";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";

import { FieldInput } from "../components/FieldInput";
import { Button } from "../components/Button";
import { pocketbase } from "../utils/pocketbase";

dayjs.extend(calendar);

interface FormValues {
  amount: number;
  text: string;
}

const validationSchema = yup.object().shape({
  amount: yup.number().min(0, "Min Value is 0").required("Required"),
  text: yup.string().required("Required"),
});

export const Dashboard = () => {
  const { data, mutate } = useSWR(
    "getExpenses/",
    async () => await pocketbase.records.getList("expenses")
  );

  const onSubmit = useCallback(
    async (values: FormValues) => {
      await pocketbase.records.create("expenses", values);
      mutate();
      formik.resetForm();
    },
    [mutate]
  );

  const formik = useFormik<FormValues>({
    initialValues: {
      amount: 0,
      text: "",
    },
    validationSchema,
    onSubmit,
  });

  const deleteFn = useCallback(
    async (id: string) => {
      await pocketbase.records.delete("expenses", id);
      mutate();
      formik.resetForm();
    },
    [mutate]
  );

  const totalAmount = useMemo(
    () => data?.items.reduce((acc, curr) => acc + curr.amount, 0),
    [data]
  );

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <form
          className="flex flex-row justify-center items-end space-x-3"
          onSubmit={formik.handleSubmit}
        >
          <FieldInput
            id="amount"
            type="number"
            label="Amount"
            name="amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
            formik={formik}
          />
          <FieldInput
            id="text"
            type="text"
            label="On what?"
            placeholder="Value..."
            name="text"
            value={formik.values.text}
            onChange={formik.handleChange}
            formik={formik}
          />
          <div className="mb-4">
            <Button type="submit" label="Submit" />
          </div>
        </form>

        <div className="w-full max-w-lg sm:p-8">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Latest Expenses
            </h5>
            <p className="text-2xl text-gray-500 truncate dark:text-gray-400">
              -${totalAmount}.00
            </p>
          </div>
          <div className="flow-root">
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {data?.items.map((item) => (
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
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
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
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
