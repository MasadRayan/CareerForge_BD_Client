import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import router from './router/router.jsx'
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "./Context/ThemeProvider";
import AuthProvider from './Context/AuthProvider.jsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
   <QueryClientProvider client={queryClient}>
      <ThemeProvider>
         <AuthProvider>
            <RouterProvider router={router}></RouterProvider>
            <Toaster />
         </AuthProvider>
      </ThemeProvider>
   </QueryClientProvider>
)