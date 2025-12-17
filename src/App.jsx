// App.jsx
import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./page/home/Home";
import Visitors from "./page/visitor/Visitors";
import VisitorCard from "./page/visitor/VisitorCard";
import Registration from "./page/exibitor/Registration";
import Login from "./page/exibitor/Login";
import Dashboard from "./page/exibitor/dashboard/Dashboard";
import HallLayout from "./page/exibitor/dashboard/StallLayout";
import PaymentDetails from "./page/exibitor/dashboard/PaymentDetails";
import ProtectedRoute from "./component/ProtectedRoute";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="visitors" element={<Visitors />} />
          <Route path="/visitor/:id/card" element={<VisitorCard />} />
          <Route path="register" element={<Registration />} />
          <Route path="login" element={<Login />} />

          {/* Exhibition Dashboard Routes with ProtectedRoute */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="hall-layout"
            element={
              <ProtectedRoute>
                <HallLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment/:stallNumber"
            element={
              <ProtectedRoute>
                <PaymentDetails />
              </ProtectedRoute>
            }
          />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

// import React from "react";
// import {
//   createBrowserRouter,
//   createRoutesFromElements,
//   Route,
//   RouterProvider,
//   Navigate,
// } from "react-router-dom";
// import Layout from "./layout/Layout";
// import Home from "./page/home/Home";
// import Visitors from "./page/visitor/Visitors";
// import Registration from "./page/exibitor/Registration";
// import Login from "./page/exibitor/Login";
// import Dashboard from "./page/exibitor/dashboard/Dashboard";
// import PaymentDetails from "./page/exibitor/dashboard/PaymentDetails";
// import StallLayout from "./page/exibitor/dashboard/StallLayout";
// // import StallMap from "./components/StallMap";

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = React.useState(false);

//   React.useEffect(() => {
//     // Check if user is logged in
//     const company = localStorage.getItem("company");
//     setIsAuthenticated(!!company);
//   }, []);

//   const router = createBrowserRouter(
//     createRoutesFromElements(
//       <>
//         {/* Public Routes */}
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="visitors" element={<Visitors />} />
//           <Route path="register" element={<Registration />} />
//           <Route path="login" element={<Login />} />
//           {/* Protected Routes */}
//           {/* <Route
//             path="/dashboard"
//             element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/payment"
//             element={
//               isAuthenticated ? <PaymentDetails /> : <Navigate to="/login" />
//             }
//           />
//           <Route
//             path="/stalls"
//             element={
//               isAuthenticated ? <StallLayout /> : <Navigate to="/login" />
//             }
//           /> */}

//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/payment" element={<PaymentDetails />} />
//           <Route path="/stalls" element={<StallLayout />} />
//         </Route>
//       </>
//     )
//   );

//   return <RouterProvider router={router} />;
// }

// export default App;
