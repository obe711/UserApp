import React, { useReducer } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { login } from "../../services/authService";
import Joi from "joi-browser";
import Copyright from "../../custom/Copyright";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const reducer = (state, action) => {
  switch (action.type) {
    case "setState":
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

const schema = {
  email: Joi.string()
    .required()
    .email()
    .label("Email"),
  password: Joi.string()
    .required()
    .min(5)
    .label("Password")
};

export default function SignIn(props) {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, {
    data: { email: "", password: "" },
    errors: {}
  });
  const validate = () => {
    const { error } = Joi.validate(state.data, schema, {
      abortEarly: false
    });
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };
  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const { error } = Joi.validate(obj, { [name]: schema[name] });
    return error ? error.details[0].message : null;
  };
  const handleChange = ({ currentTarget: input }) => {
    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...state.data };
    data[input.name] = input.value;
    dispatch({ type: "setState", payload: { data, errors } });
  };
  const handleSubmit = e => {
    e.preventDefault();
    const errors = validate();
    dispatch({ type: "setState", payload: { errors: errors || {} } });
    if (errors) return;

    doSubmit();
  };
  const doSubmit = async () => {
    try {
      const { data: jwt } = await login(state.data);
      localStorage.setItem("token", jwt);
      //this.props.history.push("/");
      props.history.replace("/");
      //window.location = "/";
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status === 400) {
        const errors = { ...state.errors };
        errors.email = ex.response.data;
        dispatch({ type: "setState", payload: { errors } });
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            error={state.errors.email && true}
            helperText={state.errors.email}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={state.data.email}
            onChange={e => {
              handleChange(e);
            }}
          />
          <TextField
            error={state.errors.password && true}
            helperText={state.errors.password}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={state.data.password}
            onChange={e => {
              handleChange(e);
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
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/xreset" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/xreset" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
