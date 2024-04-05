import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const Token = () => {
  const [token, setToken] = useState("");
  const history = useHistory();

  const handleTokenSubmit = () => {
    const storedToken = localStorage.getItem("token");
    if (token === storedToken) {
      history.push("/dashboard");
    } else {
      Swal.fire({
        icon: "error",
        title: "Token Mismatch",
        text: "The token you entered does not match the stored token. Please try again.",
      });
    }
  };

  // Move the return statement outside of handleTokenSubmit function
  return (
    <div className="container mt-3">
      <h2 className="mb-4">Enter Token</h2>
      <input
        type="text"
        placeholder="Enter your token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="form-control"
      />
      {/* Use type="button" or a form with onSubmit for better semantics */}
      <button className="btn btn-primary mt-2" onClick={handleTokenSubmit}>Submit</button>
    </div>
  );
};

export default Token;