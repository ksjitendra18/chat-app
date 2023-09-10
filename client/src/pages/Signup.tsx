import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username should be more than 3 characters",
    })
    .max(50, {
      message: "Username should not be more than 50 characters",
    }),
  name: z
    .string()
    .min(3, {
      message: "Name should be more than 3 characters",
    })
    .max(50, {
      message: "Name should not be more than 50 characters",
    }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password should be 8 or more than 8 characters",
  }),
});

const Signup = () => {
  const navigate = useNavigate();
  const [userNameHandler, setUserNameHandler] = useState<{
    isChecking?: boolean;
    isAvailable?: boolean;
    message?: string;
  }>({
    isChecking: false,
    isAvailable: false,
    message: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>();

  const onChange = useCallback(async () => {
    console.log("State value:", form.getValues("username"));
    try {
      const res = await fetch("http://localhost:8000/auth/check-username", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.getValues("username") }),
      });

      const resData = await res.json();
      if (resData.data.userNameExists) {
        form.setError("username", { message: "Username exists" });
        setUserNameHandler((prev) => ({ ...prev, isAvailable: false }));
      } else {
        console.log("here");
        setUserNameHandler((prev) => ({ ...prev, isAvailable: true }));

        console.log(userNameHandler.isChecking);
      }
    } catch (error) {
      console.log("error");
      return { success: false, isAvailable: null };
    } finally {
      setUserNameHandler((prev) => ({ ...prev, isChecking: false }));
    }
  }, []);

  useEffect(() => {
    ref.current = onChange;
  }, [onChange]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, 1000);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userNameHandler.isAvailable) {
      return;
    }
    const res = await fetch("http://localhost:8000/auth/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const resData = await res.json();
    if (resData.success) {
      navigate("/login");
    }
  }

  const onUserNameChange = async () => {
    form.clearErrors();
    setUserNameHandler({ isChecking: true });
    const username = form.getValues("username");
    if (!username || username.length < 1) {
      setUserNameHandler((prev) => ({ ...prev, isChecking: false }));

      return;
    } else if (username.length < 4) {
      setUserNameHandler((prev) => ({ ...prev, isChecking: false }));

      form.setError("username", {
        message: "Username should be 4 or more than 4 characters",
      });

      return;
    }

    debouncedCallback();
  };

  return (
    <div>
      <h2 className="text-center text-3xl font-bold my-5">Signup</h2>
      <div className="w-1/2 mx-auto mb-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem onChange={onUserNameChange}>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="heyjames" {...field} />
                  </FormControl>
                  <FormDescription>
                    {userNameHandler.isChecking ? (
                      "Checking username..."
                    ) : !userNameHandler.isChecking &&
                      userNameHandler.isAvailable ? (
                      <span className="text-green-600">Username available</span>
                    ) : null}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="James" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="james@gmail.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="8 or more characters"
                      type="password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Signup</Button>
          </form>
        </Form>
        <div className="mt-5 ">
          <p>
            Already have an account?
            <span className="ml-2 font-semibold">
              <Link className="inline" to="/login">
                Login
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
