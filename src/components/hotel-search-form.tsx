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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useSearchParams } from 'next/navigation'

const formSchema = z.object({
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  dates: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
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
      dates: {
        from: searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined,
        to: searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined,
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { location, dates } = values;
    addSearchToHistory({ location, dates });

    const params = new URLSearchParams();
    params.set("location", location);
    if (dates.from) {
      params.set("from", dates.from.toISOString());
    }
    if (dates.to) {
      params.set("to", dates.to.toISOString());
    }
    router.push(`/search?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 bg-background p-2 rounded-lg shadow-lg"
      >
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="md:col-span-1">
              <FormControl>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                   <Input
                    placeholder="Where are you going?"
                    {...field}
                    className="h-12 text-base border-0 focus-visible:ring-2 focus-visible:ring-primary pl-10"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dates"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "h-12 w-full justify-start text-left font-normal border-0 text-base",
                        !field.value.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, "LLL dd, y")} -{" "}
                            {format(field.value.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(field.value.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Check In - Check Out</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value.from}
                    selected={field.value as DateRange}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="h-12 w-full md:w-auto text-base font-bold">
          Search
        </Button>
      </form>
    </Form>
  );
}
