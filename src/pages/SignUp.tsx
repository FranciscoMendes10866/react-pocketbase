import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

import { useAuth, ICreateAccount } from "../context/AuthContext";

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8)
    .max(24)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])/)
    .matches(/^(?=.{6,20}$)\D*\d/)
    .required(),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null])
    .required(),
});

export const SignUp = () => {
  const authStore = useAuth();

  const onSubmit = useCallback(
    async (values: ICreateAccount) => {
      await authStore?.createAccount(values);
      await authStore?.login(values.email, values.password);
    },
    [authStore]
  );

  const formik = useFormik<ICreateAccount>({
    initialValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema,
    onSubmit,
  });

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="p-6 w-96 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create Account
        </h5>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="user@pocketbase.io"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="••••••••"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="passwordConfirm"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="passwordConfirm"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="••••••••"
              name="passwordConfirm"
              value={formik.values.passwordConfirm}
              onChange={formik.handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
          <div className="mt-5 mb-1.5 text-sm font-medium text-gray-500 dark:text-gray-300">
            Registered?{" "}
            <Link
              to="/sign-in"
              className="text-blue-700 hover:underline dark:text-blue-500"
            >
              Login to your account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
