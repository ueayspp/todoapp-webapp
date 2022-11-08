import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

import MuiSnackBar from "./MuiSnackBar";

import { InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  let [id, setId] = useState("");
  let [password, setPassword] = useState("");
  let navigate = useNavigate();

  let [cookies, setCookie] = useCookies(["token"]);

  const [display, setDisplay] = useState(false); // controls Alert
  const [message, setMessage] = useState(""); // controls Message
  const [severity, setSeverity] = useState("success"); // controls Severity

  const callback = () => {
    setDisplay(false);
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      id: data.get("id"),
      password: data.get("password"),
    });

    /* 
      check ID length
    */
    if (data.get("id").length !== 13) {
      setMessage("ID must be 13 digits!");
      setSeverity("warning");
      setDisplay(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="id"
              value={id}
              onChange={(event) => setId(event.target.value)}
              label="Id"
              name="id"
              autoComplete="id"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={password}
              type={showPassword ? "text" : "password"} // This is where the magic happens!
              onChange={(event) => setPassword(event.target.value)}
              name="password"
              label="Password"
              id="password"
              autoComplete="current-password"
              InputProps={{
                // This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                axios
                  .post(
                    "http://localhost:5000/tokens",
                    { id: id, password: password },
                    {
                      headers: {
                        /* Authorization: 'Bearer ' + token */
                      },
                      timeout: 10 * 1000,
                    }
                  )
                  .then((response) => {
                    setCookie("token", response.data.token);
                    navigate("/main");
                  })
                  .catch((error) => {
                    if (error.code === "ECONNABORTED") {
                      console.log("timeout");
                    } else {
                      console.log(error.response.status);
                    }
                    /* 
                      error Msg
                    */
                    setMessage("Id or Password doesn't correct!");
                    setSeverity("warning");
                    setDisplay(true);
                  });
              }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
      {display ? (
        <MuiSnackBar message={message} severity={severity} onClose={callback} />
      ) : (
        ``
      )}
    </ThemeProvider>
  );
}
