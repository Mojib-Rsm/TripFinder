
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useSearchParams } from 'next/navigation';

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
        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
      >
        <div className="md:col-span-10">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search destinations"
                      {...field}
                      className="h-12 text-base bg-white rounded-md pl-10 pr-4 text-foreground w-full"
                    />
                  </div>
                </FormControl>
                 <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="md:col-span-2">
            <Button type="submit" size="lg" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                <Search className="mr-2 h-5 w-5 md:hidden" />
                Search
            </Button>
        </div>
      </form>
    </Form>
  );
}
