import { useState, useEffect } from "react";
import { Button, Menu, MenuItem, Avatar } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "./FirebaseConfig";
import GoogleLogin from "./GoogleLogin";

const LoginProfile = ({ handleLoginSuccess, theme }) => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // Check localStorage for a logged-in user on page load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      handleLoginSuccess(parsedUser); // If you need to pass it to parent
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Handle login success from GoogleLogin
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser)); // Persist the user
    handleLoginSuccess(loggedInUser); // Notify parent
  };

  // Open profile menu
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close profile menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Logout and clear user from localStorage
  const handleLogout = async () => {
    try {
      await signOut(auth); // Use the imported auth instance
      setUser(null);
      localStorage.removeItem("user"); // Remove user info from localStorage
      handleClose();
    } catch (error) {
      console.error("Logout Error: ", error.message);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <Avatar
            src={user.photoURL}
            alt={user.displayName}
            onClick={handleAvatarClick}
            sx={{
              cursor: "pointer",
              width: 40,
              height: 40,
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />

          {/* Dropdown menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>{user.displayName}</MenuItem>
            <MenuItem disabled>{user.email}</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      ) : (
        <div>
          <GoogleLogin onLoginSuccess={handleLogin} />

      
        </div>
      )}
    </div>
  );
};

export default LoginProfile;
