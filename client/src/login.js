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
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { InputAdornment } from '@mui/material';

export default function Login() {
  const defaultTheme = createTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validationStatus, setValidationStatus] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!email) {
        setValidationStatus("The email cannot be blank. Please enter a valid one and try again!");
        return;
      } else if (!password) {
        setValidationStatus("The password cannot be blank. Please enter a valid one and try again!");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        navigate("/app", {state: user.email.substring(0, email.indexOf("@"))})
      } else {
        setValidationStatus("You need to verify your email before you can log in!");
        return;
      }
    } catch (e) {
      // console.log(e.code);
      // console.log(e.message);
      switch (e.code) {
        case "auth/invalid-email": 
          setValidationStatus("The provided email is not in the right format. Please enter a valid one and try again"); break;
        case "auth/too-many-requests":
          setValidationStatus("Too many log in attempts. Please wait for a few minutes and try again!");
          break;
        case "auth/invalid-credential": 
          setValidationStatus("The credentials you have entered are either non-existent or wrong. Please try again!"); 
          break;
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              name="password"
              label="Password"
              type= {showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              onChange = {(e) => setPassword(e.target.value)}
              value = {password}
              InputProps = {{
                endAdornment: (
                  <InputAdornment position = "end">
                    <div onClick = {() => setShowPassword((prev) => !prev)}>{!showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</div>
                  </InputAdornment>
                )
              }}
            />
            <div className = "status" style = {{color: "rgb(255, 0, 0)", textAlign: "center"}}>{validationStatus}</div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/sign_up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}