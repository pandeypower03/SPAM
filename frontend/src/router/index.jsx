import { createBrowserRouter } from "react-router-dom";
import Login from '../components/Login.jsx';
import Signup from '../components/Signup.jsx';
import Dashboard from '../components/Dashboard.jsx';
import Markspam from "../components/Markspam.jsx";
import Otp from "../components/Otp.jsx";
import AuthGaurd from '../components/AuthGaurd.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/otp",
    element: <Otp />,
  },
  {
    path: "/dashboard/",
    element: <AuthGaurd />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "markspam",
        element: <Markspam />,
      },
    ],
  },
]);

export default router;
    