import { FormikProps } from "formik";
import { FC, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  formik: FormikProps<any>;
}

export const FieldInput: FC<Props> = ({ label, formik, ...props }) => {
  const { value, ...rest } = formik.getFieldMeta(props.name);

  return (
    <div className="my-4">
      <label
        htmlFor={props.name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {label}
      </label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={value as any}
        {...rest}
        {...props}
      />
      {rest.touched && rest.error ? (
        <small className="text-red-500">{rest.error}</small>
      ) : null}
    </div>
  );
};
