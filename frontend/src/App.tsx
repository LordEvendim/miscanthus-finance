import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavigationBar } from "./components/NavigationBar";
import { About } from "./components/pages/About";
import { Contracts } from "./components/pages/Contracts";
import { Dashboard } from "./components/pages/Dashboard";
import { Mainpage } from "./components/pages/Mainpage";
import { useInitializeApp } from "./hooks/useInitializeApp";
import { Create } from "./components/pages/Create";
import { Portfolio } from "./components/pages/Portfolio";
import { Faucet } from "./components/pages/Faucet";

const App: React.FC<{}> = () => {
  const initStatus = useInitializeApp();

  useEffect(() => {
    console.log(initStatus.status);
  }, [initStatus]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/trade" element={<Dashboard />} />
        <Route path="/create" element={<Create />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/about" element={<About />} />
        <Route path="/faucet" element={<Faucet />} />
      </Routes>
    </>
  );
};

export default App;
