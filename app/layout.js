import "../styles/globals.css";

export const metadata = {
  title: "easy cut",
  description: "easy cut app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      {children}
      </body>
    </html>
  );
}
