import React, {useState} from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import {addDoc, collection} from "firebase/firestore"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { InputAdornment } from '@mui/material';
import UseAuthValidation from "./hooks/UseAuthValidation"

export default function SignUp() {
  const defaultTheme = createTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validationStatus, setValidationStatus] = useState("")

  const {isPasswordValid, showPassword, renderDisplay, togglePwDisplay} = UseAuthValidation(password)

  function validateEmail(email) {
    return fetch(`http://127.0.0.1:5000/check-email-validity?email=${email}`, {
      method: "GET"
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        return {result: data.result, status: data.status};
      })
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // email checks
      const emailCheck = await validateEmail(email);
      const {result, status} = emailCheck;
      if (!(status === 200)) {
        setValidationStatus(result);
        return;
      }

      // password checks
      if (!isPasswordValid) {
        setValidationStatus("Invalid password. Please try again!")
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, "users"), {
        "email": email,
        "password": password
      })
      await sendEmailVerification(auth.currentUser)
        .then(() => {
          setValidationStatus("Email verification link sent successfully");
          setValidationStatus("Redirecting you to the login page...");
          setTimeout(() => navigate("/login"), 3500)
        })
        .catch(() => {
          setValidationStatus("There was an error when sending the email verification link. Please try again!");
          return;
        })

      // create the user now
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        setValidationStatus("An account already exists with this email address. Please enter a valid one and try again!")
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
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange = {(e) => setEmail(e.target.value)}
                  value = {email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type= {showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  onChange = {(e) => setPassword(e.target.value)}
                  value = {password}
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
              </Grid>
              {renderDisplay()}
              <div className = "validationStatus" style = {{color: "rgb(255, 0, 0)", textAlign: "center"}}>{validationStatus}</div>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container spacing={2}>
              <Grid item xs>
                <Link href="/" variant="body2">
                  {"Back to Landing"}
                </Link>
              </Grid>
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}