import React from "react";

export default function Splash() {
  return (
    <div style={styles.container}>
      <img src="../../src/assets/favicon.svg" alt="Logo" style={styles.logo} />
      
    </div>
  );
}

const styles: { container: React.CSSProperties; logo: React.CSSProperties; title: React.CSSProperties } = {
  container: {
    position: "fixed",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    color: "#000000",
    zIndex: 9999,
  },
  logo: { width: 120, height: 120, marginBottom: 16 },
  title: { fontSize: 24, margin: 0 },
};
