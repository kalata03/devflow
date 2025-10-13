import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <Toaster richColors closeButton position="top-center" toastOptions={{ duration: 4000, style: { fontSize: '0.95rem'}}}></Toaster>
    </QueryClientProvider>
  );
}
