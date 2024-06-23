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
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPassword() {
  const defaultTheme = createTheme();
  const navigate = useNavigate();

  const [currentEmail, setCurrentEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [validationStatus, setValidationStatus] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    // check whether the email provided is a valid one and then update the password in the database
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
            Forgot Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="currentEmail"
              label="Email Address"
              name="currentEmail"
              autoComplete="email"
              autoFocus
              onChange = {(e) => setCurrentEmail(e.target.value)}
              value = {currentEmail}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              autoComplete="current-password"
              onChange = {(e) => setNewPassword(e.target.value)}
              value = {newPassword}
            />
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