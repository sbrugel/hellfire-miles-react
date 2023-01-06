import React, { useState } from "react";
import axios from "axios";
const LoginPage = ({ setLoginUser }) => {
  const [user, setUser] = useState({
    name: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const login = () => {
    axios.post("http://localhost:3000/Login", user).then((res) => {
      alert(res.data.message);
      setLoginUser(res.data.user);
    });
  };

  return (
    <>
      <div>
        <h1>Login to your account</h1>
        <p>
          Don't have an account? <a href="/">Register here.</a>
        </p>
        <div>
          <form action="#">
            <div>
              <input
                type="text"
                id="sign-in-name"
                name="name"
                value={user.name}
                onChange={ handleChange }
                placeholder="Username"
              />
            </div>
            <div class="flex flex-col mb-6">
              <input
                type="password"
                id="sign-in-password"
                name="password"
                value={ user.password }
                onChange={ handleChange }
                placeholder="Password"
              />
            </div>
            <p>
              <a href="a">Forgot your password?</a>
            </p>
            <div class="flex w-full">
              <button type="submit" onClick={login}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
