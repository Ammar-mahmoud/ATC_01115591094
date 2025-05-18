"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoginSchema } from "@/utils/schema/login";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Toast from "../../toast";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import authService from "@/lib/domain/auth/auth.service";
import { useUserContext } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
export function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<any>(null);
  const { login } = useUserContext();
  const router = useRouter();
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      validateOnChange={true}
      validateOnBlur={true}
      validateOnMount={true}
      onSubmit={async (values: any, { resetForm }) => {
        console.log(values);
        setLoading(true);
        try {
          const response: any = await authService.login(values);
          console.log("status", response.data);
          console.log("token",response.data.token)
          localStorage.setItem("authToken", response.data.token);
          document.cookie = `authToken=${response.data.token}; Path=/; Secure; SameSite=Strict; Max-Age=86400`;
          console.log(response.data.data)
          login(response.data.data);
          setToast({ title: response.data.message, status: "success" });
            resetForm();
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
          setTimeout(() => {
            setLoading(false);
            router.replace("/");
          }, 2000);
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
          <div className="flex flex-col items-center gap-2 text-center">
            {toast && (
              <Toast
                title={toast.title}
                status={toast.status}
                onDismiss={() => setToast(null)}
              />
            )}
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
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
            <div className="grid gap-2">
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
            <Button
              type="submit"
              disabled={!isValid || loading}
              className={`w-full cursor-pointer ${
                (!isValid || loading) && "bg-neutral-200"
              }`}
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} /> : "Signup"}
            </Button>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"></div>
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="/auth/sign-up" className="underline underline-offset-4">
              Login
            </a>
          </div>
        </Form>
      )}
    </Formik>
  );
}
