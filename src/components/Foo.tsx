import React from "react";
import Layout from "./Layout";
import { Link } from "@mfng/core/client";
import Content from "../../data";

export function Foo() {
  return (
    <Layout>
      <div>This is foo</div>
      <Link to={{pathname: "/"}}>Go back</Link>
      <Content />
    </Layout>
  );
}
