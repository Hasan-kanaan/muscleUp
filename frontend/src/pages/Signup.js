import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";


function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        process.env.REACT_APP_API + "/api/user/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const json = await response.json();

      if (!response.ok) {
        setError(json.msg);
      } else {
        setError(null);
        localStorage.setItem("user", JSON.stringify(json));
        dispatch({ type: "SIGNUP", payload: json });
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="signupWrapper">
      <form className="signup" onSubmit={handleSubmit}>
        <h3>Sign up</h3>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          required
          placeholder="johndoe@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        <button disabled={loading}>{!loading ? "Sign up" : "Loading..."}</button>
      </form>
    </div>
  );
}

export default Signup;
