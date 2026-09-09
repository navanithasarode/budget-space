import React from "react";
export default function Stat({ label, value, hint }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong>{hint && <small>{hint}</small>}</div>;
}
