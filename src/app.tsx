import { MetaProvider, Title, Link } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { authServer, resourceServer } from "./lib/store";

export default function App() {
  // get auth server definition 
  fetch("/schema/auth.json")
    .then(async (response) => {
      const auth = await response.json();
      authServer.setAddress(auth.address);
    })
    .catch((error) => {
      console.error(error);
    });

  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>SolidStart</Title>
          <Link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;500;600;700;900&amp;display=swap" />
          <Link rel="stylesheet" href="/fonts/bbthings_icon.css" />
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
