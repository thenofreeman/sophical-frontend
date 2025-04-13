import React from "react";
import Navbar from "../components/Navbar";
import { UIStyle } from "../types/UI";

interface MainLayoutStyle {
  children: React.ReactNode,
  style: UIStyle,
}

export default function MainLayout({ children, style }: MainLayoutStyle): React.ReactElement {
  return (
    <>
      <Navbar style={style} />
      { children }
    </>
  );
}
