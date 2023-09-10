import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuthStore from "@/store/useAuth";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password should be 8 or more than 8 characters",
  }),
});

const Login = () => {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    form.clearErrors();
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const resData = await res.json();
      console.log("user", resData);
      if (resData.success) {
        const token = res.headers.get("x-auth-token");
        console.log("token is", res.headers);
        Cookies.set("auth-token", token!, {
          expires: 1,
          sameSite: "lax",
        });

        setUser(resData.data);

        navigate("/chat");
      } else {
        form.setError("email", { message: "Invalid email or pasword" });
        form.setError("password", { message: "Invalid email or pasword" });
      }
    } catch (error) {
      console.log("Error");
    }
  }

  return (
    <div>
      <h2 className="text-center text-3xl font-bold my-5">Login</h2>
      <div className="w-1/2 mx-auto mb-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <Button type="submit">Login</Button>
          </form>
        </Form>
        <div className="mt-5 ">
          <p>
            Don't have an account?
            <span className="ml-2 font-semibold">
              <Link className="inline" to="/signup">
                Signup
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
