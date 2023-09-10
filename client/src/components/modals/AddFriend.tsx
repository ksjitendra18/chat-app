import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCallback, useState, useEffect, useMemo, useRef } from "react";

import { useForm } from "react-hook-form";

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
import { useModal } from "@/hooks/useModal";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import { z } from "zod";
import { Button } from "../ui/button";
import useAuthStore from "@/store/useAuth";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username should be more than 3 characters",
    })
    .max(50, {
      message: "Username should not be more than 50 characters",
    }),
});

const AddFriend = () => {
  const { isOpen, type, onClose } = useModal();
  const navigate = useNavigate();

  const { user } = useAuthStore();

  const isModalOpen = isOpen && type === "createConversation";

  const handleClose = () => {
    onClose();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch("http://localhost:8000/conversation/create", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memberOneId: user?.userId,
        memberTwoUsername: values.username,
      }),
    });

    const resData = await res.json();
    if (resData.self) {
      form.setError("username", {
        message: "You cannot create conversation with yourself",
      });

      return;
    }
    if (resData.success) {
      navigate(`/conversation/${resData.data.id}`);
      form.reset();
      onClose();
    }
  }

  const [userNameHandler, setUserNameHandler] = useState<{
    isChecking?: boolean;
    isAvailable?: boolean;
    name?: string;
  }>({
    isChecking: false,
    isAvailable: false,
    name: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>();

  const onChange = useCallback(async () => {
    form.clearErrors();
    try {
      const res = await fetch("http://localhost:8000/auth/check-username", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.getValues("username") }),
      });

      const resData = await res.json();

      console.log("resdata", resData);
      if (resData.data.userNameExists) {
        setUserNameHandler((prev) => ({
          ...prev,
          isAvailable: true,
          name: resData.data.name,
        }));
      } else {
        setUserNameHandler((prev) => ({ ...prev, isAvailable: false }));
        form.setError("username", { message: "User does not exists" });
        console.log(userNameHandler.isChecking);
      }
    } catch (error) {
      console.log(error);
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

  const onUserNameChange = () => {
    debouncedCallback();
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black px-4 py-2 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Create a conversation
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem onChange={onUserNameChange}>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        className="text-white"
                        placeholder="heyjames"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {userNameHandler.isChecking ? (
                        "Checking username..."
                      ) : !userNameHandler.isChecking &&
                        userNameHandler.isAvailable ? (
                        <span className="text-green-600 text-xl my-3">
                          Message {userNameHandler.name}
                        </span>
                      ) : null}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant={"ghost"}
                disabled={!userNameHandler.isAvailable}
                className="w-full border-2 border-primary-foreground"
              >
                Create Conversation
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddFriend;
