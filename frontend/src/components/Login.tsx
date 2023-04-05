import React, { useCallback, useState } from "react";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios"
import * as Yup from "yup";
import { login } from "../services/auth.service";

import { Provider, Network } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";


const provider = new Provider(Network.DEVNET);

type Props = {}
const Login: React.FC<Props> = () => {

  const { account, connected } = useWallet();

  let navigate: NavigateFunction = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const initialValues: {
    email: string;
    password: string;
  } = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });

  // const handleSignIn = useCallback(async (formValue: { email: string; password: string }) => {
  //   const { email, password } = formValue;

  //   setMessage("");
  //   setLoading(true);

  //   try {
  //     const path = "api/users/login";
  //     console.log(axios);
  //     const response = await axios.post(path, { email, password });
  //     console.log("OK", response);
  //     if (response.data.accessToken) {
  //       localStorage.setItem("user", JSON.stringify(response.data));
  //     }
  //     navigate("/profile");
  //     //      window.location.reload();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [setMessage, setLoading, axios])

  const handleLogin = async (formValue: { email: string; password: string }) => {
    if(!account) return ;
    
    const { email, password } = formValue;

    setMessage("");
    setLoading(true);
    login(email, password, account).then(
      () => {
        navigate("/profile");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
    // try {
    //   const path = "http://127.0.0.1:5000/api/users/login";
    //   console.log(axios);
    //   const response = await axios.post(path, { email, password, account });
    //   console.log("OK", response);
    //   if (response.data.accessToken) {
    //       localStorage.setItem("user", JSON.stringify(response.data));
    //     }
    //     navigate("/profile");
    //     window.location.reload();
    // } catch (error) {
    //   console.error(error);
    // }
  };
  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>


            <div className="form-group">
              <label htmlFor="email"> Email </label>
              <Field name="email" type="email" className="form-control" />
              <ErrorMessage
                name="email"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="alert alert-danger"
              />
            </div>
            {
              <div className="form-group">
                <button type="submit" className="btn btn-primary btn-block" disabled={loading || !connected}>
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>{connected ? "Login" : "connect wallet first"}</span>
                </button>
              </div>
            }
            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
