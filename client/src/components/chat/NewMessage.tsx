import { useForm } from "react-hook-form";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

const formSchema = z.object({
  message: z.string(),
});

const NewMessage = ({ io }: { io: Socket }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { conversationId } = useParams();

  // if (conversationId !== undefined) {

  useEffect(() => {
    io.emit("join_conversation", conversationId);

    return () => {
      io.removeListener("join_conversation");
    };
  }, [io, conversationId]);
  // }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    io.emit("send_message", {
      message: values.message,
      conversationId: conversationId,
      userName: user?.userName,
      userId: user?.userId,
    });

    form.reset();
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="py-5 w-full justify-center items-center flex gap-5"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    className="text-white"
                    placeholder="message"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant={"ghost"}
            className=" mt-0 space-y-0 bg-[#3549ff]"
          >
            <Send className="text-white " />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewMessage;
