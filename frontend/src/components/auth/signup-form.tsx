"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import authService from "@/lib/domain/auth/auth.service";
import { ICreateUser, SignUpResponse } from "@/lib/types/auth";
import { SignupSchema } from "@/utils/schema/signup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import Toast from "../../toast";
export function SignupForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<any>(null);
  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        gender: "",
        password: "",
        passwordConfirm: "",
      }}
      validationSchema={SignupSchema}
      validateOnChange={true}
      validateOnBlur={true}
      validateOnMount={true}
      onSubmit={async (values: ICreateUser, { resetForm }) => {
        console.log(values);
        setLoading(true);
        try {
          const response: SignUpResponse = await authService.signup(values);
          console.log("status", response.status);
          setToast({ title: response.data.message, status: "success" });
          if (response.data.token) {
            localStorage.setItem("authToken", response.token);
            resetForm();
          }
        } catch (err) {
          console.log(err.response.errors);
          const errors = Array.isArray(err.response.errors)
            ? err.response.errors.reduce((acc, item) => {
                acc += item.msg + "";
                return acc;
              }, "")
            : "Error";
          setToast({ title: errors, status: "error" });
        } finally {
          setTimeout(() => setLoading(false), 2000);
        }
      }}
    >
      {({ errors, touched, isValid }) => (
        <Form className="flex flex-col gap-6">
          <a
            href="#"
            title="BakerStreet"
            className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-secondary focus:ring-primary"
          >
            <img
              className="m-auto w-auto h-15 bg-red-500 rounded-md"
              src="https://i.postimg.cc/wTqXL7n0/Zevent-photoaidcom-invert-1.png"
              alt="BakerStreet"
            />
          </a>
          <div className="flex flex-col  gap-2 ">
            {toast && (
              <Toast
                title={toast.title}
                status={toast.status}
                onDismiss={() => setToast(null)}
              />
            )}
            <h1 className="text-2xl font-bold text-left ">Create account</h1>
            <p className="text-sm text-muted-foreground">
              One Account, Every Category – Find & Attend What You Love!
            </p>
          </div>
          <div className="grid gap-6">
            {
              // name
            }
            <div className="grid gap-1">
              <Label htmlFor="name">Name</Label>
              <Field
                name="name"
                type="name"
                className={`w-full rounded-lg border p-2 text-grayscale-700 ${
                  errors.name && touched.name
                    ? "border-red-500"
                    : "border-grayscale-75"
                }`}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="m-0 text-sm text-red-400 text-alert-error"
              />
            </div>
            {
              // email
            }
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Field
                name="email"
                type="email"
                className={`w-full rounded-lg border p-2 text-grayscale-700 ${
                  errors.email && touched.email
                    ? "border-red-500"
                    : "border-grayscale-75"
                }`}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="m-0 text-sm text-red-400 text-alert-error"
              />
            </div>
            {
              // gender
            }
            <div className="grid gap-1">
              <Label htmlFor="gender">Gender</Label>
              <div className="flex flex-row gap-2">
                <label>Male</label>
                <Field
                  name="gender"
                  type="radio"
                  value="Male"
                  className={` rounded-lg border p-2 text-grayscale-700 ${
                    errors.gender && touched.gender
                      ? "border-red-500"
                      : "border-grayscale-75"
                  }`}
                />
                <label>Female</label>
                <Field
                  name="gender"
                  type="radio"
                  value="Female"
                  className={` rounded-lg border p-2 text-grayscale-700 ${
                    errors.gender && touched.gender
                      ? "border-red-500"
                      : "border-grayscale-75"
                  }`}
                />
              </div>
              <ErrorMessage
                name="gender"
                component="div"
                className="m-0 text-sm text-red-400 text-alert-error"
              />
            </div>
            {
              // password
            }
            <div className="grid gap-1">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Field
                name="password"
                type="password"
                className={`w-full rounded-lg border p-2 text-grayscale-700 ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : "border-grayscale-75"
                }`}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="m-0 text-sm text-red-400 text-alert-error"
              />
            </div>
            {
              // confirm password
            }
            <div className="grid gap-1">
              <div className="flex items-center">
                <Label htmlFor="passwordConfirm">Confirm Password</Label>
              </div>
              <Field
                name="passwordConfirm"
                type="passwordConfirm"
                className={`w-full rounded-lg border p-2 text-grayscale-700 ${
                  errors.passwordConfirm && touched.passwordConfirm
                    ? "border-red-500"
                    : "border-grayscale-75"
                }`}
              />
              <ErrorMessage
                name="passwordConfirm"
                component="div"
                className="m-0 text-sm text-red-400 text-alert-error"
              />
            </div>
            <Button
              type="submit"
              disabled={!isValid || loading}
              className={`w-full cursor-pointer ${
                (!isValid || loading) && "bg-neutral-200"
              }`}
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} /> : "Signup"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
