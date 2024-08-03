import React, {useState} from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { InputAdornment } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {collection, query, where, getDocs, updateDoc} from "firebase/firestore"
import { auth, db } from './firebase';
import { updatePassword } from 'firebase/auth';
import UseAuthValidation from './hooks/UseAuthValidation';

export default function ForgotPassword() {
  const defaultTheme = createTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state;

  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [validationStatus, setValidationStatus] = useState("")

  const {isPasswordValid, showPassword, renderDisplay, togglePwDisplay} = UseAuthValidation(newPassword)

  async function handleSubmit(e) {
    e.preventDefault();
    try {
        if (!email) {
          setValidationStatus("The email cannot be blank. Please enter a valid one and try again!");
          return;
        }
        if (!newPassword) {
          setValidationStatus("The new password cannot be blank. Please enter a valid one and try again!");
          return;
        } else {
          // password checks
          if (!isPasswordValid) {
            setValidationStatus("Invalid password. Please try again!");
            return;
          }

          const q = query(collection(db, "users"), where("email", "==", email));
          const snapshot = await getDocs(q);
          const docs = snapshot.docs;
          if (docs.length === 0) {
            setValidationStatus("This email is non-existent. Please enter a valid one and try again!");
            return;
          } else {
            const doc = docs[0];
            const data = doc.data();
            if (data.password === newPassword) {
              setValidationStatus("The new password cannot be the same as your previous one. Please use a different one and try again!");
              return;
            } else {
              if (auth.currentUser === null) {
                setValidationStatus("You must have logged in atleast once prior to resetting your password");
                return;
              }
              await updatePassword(auth.currentUser, newPassword)
                .then(() => {
                  const ref = doc.ref;
                  updateDoc(ref, {password: newPassword});
                  setValidationStatus("Password updated successfully");
                  setValidationStatus("Signing you out and redirecting to the login page...");
                  setTimeout(() => navigate("/login"), 1500)
                })
                .catch((e) => {
                  setValidationStatus("Internal server error when updating password");
                  return;
                })
            }
          }
        }
    } catch (e) {
      if (e.code === "auth/missing-email") {
        setValidationStatus("The email you have entered is invalid. Please enter a valid one and try again!");
        return;
      }
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '400px'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange = {(e) => setEmail(e.target.value)}
              value = {email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type= {showPassword ? "text" : "password"}
              id="newPassword"
              autoComplete="current-password"
              onChange = {(e) => setNewPassword(e.target.value)}
              value = {newPassword}
              InputProps = {{
                endAdornment: (
                  <InputAdornment position = "end">
                    <div 
                      onClick = {togglePwDisplay}
                      style = {{cursor: "pointer", display: "flex"}}
                    >
                      {!showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </div>
                  </InputAdornment>
                )
              }}
            />
            {renderDisplay()}
            <div className = "validationStatus" style = {{color: "rgb(255, 0, 0)", textAlign: "center", marginTop: "20px"}}>{validationStatus}</div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
            <Grid container justifyContent= "center">
              <Link variant="body2" onClick = {() => navigate("/app", {state: username})} style = {{cursor: "pointer"}}>
                 Back to home
              </Link>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}