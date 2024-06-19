import React, {useState, useEffect} from 'react'
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
import { app } from './firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { validateEmailFormat, validateEmailExistence } from './utils';

// To-dos
  // implement logic for email validation
    // has to be of the right format
    // has to be a valid existent email in the world wide web(need to find a way to check for this)
  // implement logic for password checking as the user is typing in the password
    // requirements:
      // 1. 8 characters min - need regex for this
      // 2. must contain atleast one lowercase character - need regex for this
      // 3. must contain atleast one upppercase character - need regex for this
      // 4. must contain atleast one special character - need regex for this
      // 5. must contain atleast one number - need regex for this
  // implement sign up user logic via firebase

export default function SignUp() {
  const defaultTheme = createTheme();
  const navigate = useNavigate();
  const auth = getAuth(app);

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validationStatus, setValidationStatus] = useState("")

  const [hasMinChars, setHasMinChars] = useState(false)
  const [hasLowercase, setHasLowerCase] = useState(false)
  const [hasUpperCase, setHasUpperCase] = useState(false)
  const [hasSpecial, setHasSpecial] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)

  useEffect(() => {
    setHasNumber(/^\d+$/.test(password))
    setHasMinChars(password.length >= 8)
    setHasLowerCase(/[a-z]/.test(password))
    setHasUpperCase(/[A-Z]/.test(password))
    setHasSpecial(/[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/.test(password))
  }, [password])

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // email checks
      if (!validateEmailFormat(email)) {
        setValidationStatus("Invalid email format. Please enter a valid one and try again!");
        return;
      }
      if (!validateEmailExistence(email)) {
        setValidationStatus("This email is non-existent. Make sure you enter an existent one!");
        return;
      }

      // password checks
      if (!hasMinChars) {
        setValidationStatus("The password needs to be atleast 8 characters long")
        return;
      }
      if (!hasLowercase) {
        setValidationStatus("The password needs to have atleast one lowercase character");
        return;
      }
      if (!hasUpperCase) {
        setValidationStatus("The password needs to have atleast one uppercase character");
        return;
      }
      if (!hasNumber) {
        setValidationStatus("The password needs to have atleast one digit");
        return;
      }
      if (!hasSpecial) {
        setValidationStatus("The password needs to have atleast one special character");
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login")

      // create the user now
    } catch (e) {
      if (e.code == "email-already-in-use") {
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
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange = {(e) => setPassword(e.target.value)}
                  value = {password}
                />
              </Grid>
              <div className = "pw-reqs" style = {{display: "grid", gridTemplateRows: "repeat(3, 1fr)", gridTemplateColumns: "repeat(2, 1fr)", margin: "0 auto", marginTop: "10px", columnGap: "15px"}}>
                <li style = {{color: `${hasMinChars ? "rgb(0, 255, 0)" : "rgb(0, 0, 0)"}`}}>8 characters</li>
                <li style = {{color: `${hasLowercase ? "rgb(0, 255, 0)" : "rgb(0, 0, 0)"}`}}>One lowercase letter</li>
                <li style = {{color: `${hasUpperCase ? "rgb(0, 255, 0)" : "rgb(0, 0, 0)"}`}}>One uppercase letter</li>
                <li style = {{color: `${hasNumber ? "rgb(0, 255, 0)" : "rgb(0, 0, 0)"}`}}>One number</li>
                <li style = {{color: `${hasSpecial ? "rgb(0, 255, 0)" : "rgb(0, 0, 0)"}`}}>One special character</li>
              </div>
              <div className = "status" style = {{color: "rgb(255, 0, 0)", textAlign: "center"}}>{validationStatus}</div>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
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