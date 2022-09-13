import { BrowserRouter, Routes, Route } from "react-router-dom";

import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { AuthProvider } from "./context/AuthContext";

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
