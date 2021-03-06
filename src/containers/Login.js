import React, { useState, useEffect } from "react";
import { useHistory, withRouter } from "react-router-dom";

import axios from "axios";

import { Logo, PATH_PREFIX } from "../utils/Utils";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';

import '../assets/css/Login.css';

export const isLogged = () => {
    try {
        const { token } = JSON.parse(localStorage.getItem('userInfo'));
        return !!token;
    }
    catch {
        return false;
    }
}


const Login = () => {
  let history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dialogMessage, setDialogMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
      if (isLogged()) {
          history.push(PATH_PREFIX + '/admin');
      }
  });

  const login = () => {
      axios.post(`/auth`, {
          userName: username,
          password: password,
      }).then((response) => {
          if (response.data.auth) {
              localStorage.setItem('userInfo', JSON.stringify({ token: response.data.token }));
              history.push(PATH_PREFIX + '/admin');
          } else {
              setDialogMessage('Invalid username and password!');
              setShowMessage(true);
          }
          setUsername('');
          setPassword('');
      }).catch((error) => {
          setDialogMessage('Connection fails');
          setShowMessage(true);
      });
  }

  const handleKeypress = e => {
      if (username.length && password.length && e.key === "Enter") {
          login();
      }
  };

  return (
    <React.Fragment>
      <div className="login-form p-my-5">
          <Dialog
              visible={showMessage}
              position="top"
              style={{ width: '30vw' }}
              onHide={() => setShowMessage(false)}
            >
              <div className="p-d-flex p-ai-center p-dir-col">
                  <i className="pi pi-times-circle p-py-3" style={{ fontSize: '5rem', color: 'red' }}></i>
                  <h5>{dialogMessage}</h5>
              </div>
          </Dialog>

          <div className="p-d-flex p-jc-center">
              <div className="card">
                  <div className="p-d-flex p-jc-center p-mb-3">
                      <img src={Logo} alt="Special Collections" width="100" height="100" />
                  </div>
                  <div className="p-fluid">
                      <div className="p-field">
                          <span className="p-float-label p-input-icon-right">
                              <InputText value={username} onChange={(e) => setUsername(e.target.value)} onKeyPress={handleKeypress}  />
                              <label htmlFor="username">Username</label>
                          </span>
                      </div>
                      <div className="p-field">
                          <span className="p-float-label">
                          <Password value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} toggleMask onKeyPress={handleKeypress} />
                              <label htmlFor="password">Password</label>
                          </span>
                      </div>

                      <Button label="Login" className="p-mt-2" disabled={!username.length || !password.length} onClick={login} />
                  </div>
              </div>
          </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Login);
