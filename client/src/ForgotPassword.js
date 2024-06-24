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
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { updatePassword } from 'firebase/auth';

export default function ForgotPassword() {
  const defaultTheme = createTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [validationStatus, setValidationStatus] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [hasMinChars, setHasMinChars] = useState(false)
  const [hasLowercase, setHasLowerCase] = useState(false)
  const [hasUpperCase, setHasUpperCase] = useState(false)
  const [hasSpecial, setHasSpecial] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)

  useEffect(() => {
    setHasNumber(/\d/.test(newPassword))
    setHasMinChars(newPassword.length >= 8)
    setHasLowerCase(/[a-z]/.test(newPassword))
    setHasUpperCase(/[A-Z]/.test(newPassword))
    setHasSpecial(/[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/.test(newPassword))
  }, [newPassword])
  
  function checkEmailExistenceForReset() {
    return fetch(`http://127.0.0.1:5000/firebase-email-existence?email=${email}`, {
      method: "GET"
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        return data.status;
      })
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const status = await checkEmailExistenceForReset(email);
      if (!(status === "Success")) {
        setValidationStatus(status);
        return;
      } else {
        if (!newPassword) {
          setValidationStatus("The new password cannot be blank. Please enter a valid one and try again!");
          return;
        } else {
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

          // check if the new password is the same as the old one and if not only then update
          // when new user is created store their username and password in firestore and then reference that when doing this
          
          // await updatePassword(auth.currentUser, newPassword)
          //   .then(() => {
          //     setValidationStatus("Password updated successfully");
          //     setValidationStatus("Redirecting you to the login page...")
          //     setTimeout(() => navigate("/login"), 1500)
          //   })

        }
      }
    } catch (e) {
      console.log(e.message);
      console.log(e.code);
      if (e.code == "auth/missing-email") {
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
                    <div onClick = {() => setShowPassword((prev) => !prev)}>{!showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</div>
                  </InputAdornment>
                )
              }}
            />
            <div className = "pw-reqs" style = {{display: "grid", gridTemplateRows: "repeat(3, 1fr)", gridTemplateColumns: "repeat(2, 1fr)", margin: "0 auto", marginTop: "10px", columnGap: "15px"}}>
                <li style = {{color: `${hasMinChars ? "rgb(0, 255, 0)" : "rgb(0, 0, 0)"}`}}>8 characters</li>
                <li style = {{color: `${hasLowercase ? "rgb(0, 255, 0)" : "rgb(0, 0, 0)"}`}}>One lowercase letter</li>
                <li style = {{color: `${hasUpperCase ? "rgb(0, 255, 0)" : "rgb(0, 0, 0)"}`}}>One uppercase letter</li>
                <li style = {{color: `${hasNumber ? "rgb(0, 255, 0)" : "rgb(0, 0, 0)"}`}}>One number</li>
                <li style = {{color: `${hasSpecial ? "rgb(0, 255, 0)" : "rgb(0, 0, 0)"}`}}>One special character</li>
              </div>
            <div className = "status" style = {{color: "rgb(255, 0, 0)", textAlign: "center"}}>{validationStatus}</div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Log into an existing account"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}