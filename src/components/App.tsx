import React from "react";
import Layout from "./Layout";
import {Counter} from "./counter";
import { Link } from "@mfng/core/client";

export function App() {
  return (
    <Layout>
      <div>Hello world</div>
      <Counter />
      <Link to={{pathname: "/foo"}}>Click me</Link>
    </Layout>
  );
}
