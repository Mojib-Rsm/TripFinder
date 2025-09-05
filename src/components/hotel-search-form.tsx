"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useSearchParams } from 'next/navigation'

const formSchema = z.object({
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
});

export default function HotelSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addSearchToHistory } = useSearchHistory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: searchParams.get('location') || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { location } = values;
    addSearchToHistory({ location, dates: {} });

    const params = new URLSearchParams();
    params.set("location", location);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative"
      >
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                   <Input
                    placeholder="Places to go, things to do, hotels..."
                    {...field}
                    className="h-14 text-base bg-white rounded-full pl-12 pr-32 text-black"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold">
          Search
        </Button>
      </form>
    </Form>
  );
}
