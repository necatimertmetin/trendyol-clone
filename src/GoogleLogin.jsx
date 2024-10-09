import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const GoogleLogin = ({ onLoginSuccess }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on page load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      onLoginSuccess(JSON.parse(storedUser)); // If you need to pass it to parent
    }
  }, [onLoginSuccess]);

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      setUser(loggedInUser);
      onLoginSuccess(loggedInUser);

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      console.log("User Info: ", loggedInUser);
    } catch (error) {
      console.error("Login Error: ", error.message);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Hoşgeldiniz, {user.displayName}</p>
          <p>{user.email}</p>
        </div>
      ) : (
        <Button
          onClick={handleGoogleLogin}
          variant="outlined"
          sx={{
            marginRight: 2,
            borderRadius: "20px",
            borderColor: "#04C8C8", // Your desired color
            color: "#04C8C8", // Your desired color
            "&:hover": {
              borderColor: "#0288D1", // Hover effect
              color: "#0288D1", // Hover effect
            },
          }}
        >
          Google ile Giriş Yap
        </Button>
      )}
    </div>
  );
};

export default GoogleLogin;
