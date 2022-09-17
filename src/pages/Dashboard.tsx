import { useFormik } from "formik";
import { useCallback } from "react";
import * as yup from "yup";
import useSWR from "swr";

import { FieldInput } from "../components/FieldInput";
import { Button } from "../components/Button";
import { List } from "../components/List";

import { pocketbase } from "../utils/pocketbase";

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
    },
    [mutate]
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

        <List data={data} deleteFn={deleteFn} />
      </div>
    </div>
  );
};
