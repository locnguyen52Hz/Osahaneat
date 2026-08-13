import React from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { useBuyerInitializer } from "../../../hooks/useBuyerInitializer";

function BuyerInitializer() {
  useBuyerInitializer();
  const context = useOutletContext();

  return <Outlet context={context} />;
}

export default BuyerInitializer;
