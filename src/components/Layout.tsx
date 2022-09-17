import { Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { Button } from "./Button";

export const Layout = () => {
  const authStore = useAuth();

  return (
    <div>
      <nav className="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <a href="https://pocketbase.io/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              PocketBase
            </span>
          </a>

          {authStore?.user && (
            <div className="flex md:order-2">
              <Button label="Logout" onClick={authStore?.logout} />
            </div>
          )}
        </div>
      </nav>

      <Outlet />
    </div>
  );
};
