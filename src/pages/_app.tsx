import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TaskProvider } from "@/contexts/TaskContext";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TaskProvider>
          <Sonner />
          <Component {...pageProps} />;
        </TaskProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
