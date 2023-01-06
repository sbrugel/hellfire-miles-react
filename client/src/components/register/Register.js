import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const register = () => {
    const { name, email, password } = user;
    if (name && email && password) {
      axios
        .post("http://localhost:3000/Register", user)
        .then((res) => console.log(res));
    } else {
      alert("You are missing a field!");
    }
  };

  return (
    <>
      <div>
        <h1>Create a new account</h1>
        <p>Already have an account? <a href="/login">Sign in here.</a></p>
        <div class="p-6 mt-8">
          <form action="#">
            <div>
                <input
                    type="text"
                    id="create-account-name"
                    name="name"
                    value={ user.name }
                    onChange={ handleChange }
                    placeholder="Username"
                />
            </div>
            <div>
                <input
                  type="text"
                  id="create-account-email"
                  name="email"
                  value={ user.email }
                  onChange={ handleChange }
                  placeholder="Email"
                />
            </div>
            <div>
                <input
                  type="password"
                  id="create-account-password"
                  name="password"
                  value={ user.password }
                  onChange={ handleChange }
                  placeholder="Password"
                />
            </div>
            <div>
              <button
                type="submit"
                onClick={register}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;