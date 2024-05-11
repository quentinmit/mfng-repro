import React, { ReactNode, Suspense } from "react";
import { Counter } from "./counter";


const Layout = ({
  children,
  scripts,
  title,
}: {
  children: ReactNode;
  scripts?: string[];
  title?: string;
}) => {
  return (
    <html>
      <head>
        {title && <title>{title}</title>}
        {scripts && scripts.map((s) => `<script src="${s}"></script>`)}
      </head>
      <body>
        <Suspense>
          <Counter />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <div style={{ flex: 1 }}>{children}</div>
        </div>
        </Suspense>
      </body>
    </html>
  );
};

export default Layout;
