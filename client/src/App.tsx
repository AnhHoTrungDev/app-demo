import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
// import "./App.css";
import "./style/index.scss";
import "./index.css";
import { API } from "config/API";
import AnimationBackgroundWrapper from "compoment/animationBackgroundWrapper";

let count = 0;

function App() {
  const [currentUser, setCurrentUser] = useState<any>({});
  const login = () => {
    API.login("john", "changeme").then((response) => {
      console.log(" login:>> ", response);
      setCurrentUser((response as any)["current-user"]);
    });
  };

  const log = () => {
    API.log(count).then((response) => {
      console.log("log 1 response", response);
    });
    count++;
  };

  useEffect(() => {
    API.refreshToken().then((response) => {
      console.log("refresh token :>> ", response);

      setCurrentUser((response as any)["current-user"]);
    });
  }, []);

  return (
    <AnimationBackgroundWrapper>
      <div className="app">
        <div className="container-center">
          <div className="container">
            <div className="w-full">
              <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                    id="username"
                    type="text"
                    placeholder="Username"
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline "
                    id="password"
                    type="password"
                    placeholder="******************"
                  />
                  <p className="text-red-500 text-xs italic">
                    Please choose a password.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Sign In
                  </button>
                  <a
                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    href="x"
                  >
                    Forgot Password?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AnimationBackgroundWrapper>
  );
}

export default App;
