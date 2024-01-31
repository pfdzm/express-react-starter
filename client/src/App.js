import styles from "./App.module.css";
import { useState } from "react";

const runAsync = (fn) => {
  fn().catch((error) => console.error(error));
};
function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        runAsync(async () => {
          await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              password: password,
            }),
          });
        });
      }}
    >
      <label htmlFor="username">Username</label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        id="username"
        required
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button>Log in</button>
    </form>
  );
}

export default App;
