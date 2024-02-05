import Login from "@/Components/auth/Login";
import Image from "next/image";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {


  return (
    <main className="flex">
      
   <Login />
   <ToastContainer />
    </main>
  );
}
