import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

import { FieldInput } from "../components/FieldInput";
import { Button } from "../components/Button";
import { Link } from "../components/Link";

import { useAuth } from "../context/AuthContext";

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8)
    .max(24)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])/)
    .matches(/^(?=.{6,20}$)\D*\d/)
    .required(),
});

interface ISignInFormik {
  email: string;
  password: string;
}

export const SignIn = () => {
  const authStore = useAuth();
  const navigate = useNavigate()

  const onSubmit = useCallback(
    async (values: ISignInFormik) => {
      await authStore?.login(values.email, values.password);
      navigate("/dashboard")
    },
    [authStore]
  );

  const formik = useFormik<ISignInFormik>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit,
  });

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="p-6 w-96 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome back!
        </h5>
        <form onSubmit={formik.handleSubmit}>
          <FieldInput
            id="email"
            type="email"
            label="Email"
            placeholder="user@pocketbase.io"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            formik={formik}
          />
          <FieldInput
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            formik={formik}
          />
          <Button type="submit" label="Submit" />
          <Link
            label="Not registered?"
            linkLabel="Create an account"
            to="/"
          />
        </form>
      </div>
    </div>
  );
};
