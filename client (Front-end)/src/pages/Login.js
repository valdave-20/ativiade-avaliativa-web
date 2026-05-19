import React from "react";

function Login() {
  return (
    <div>
      <h2>Login</h2>
      <form>
        <div>
          <label>
            Email
            <input type="email" name="email" />
          </label>
        </div>
        <div>
          <label>
            Senha
            <input type="password" name="password" />
          </label>
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
