import "./globals.css";
import Providers from "@/components/Providers";
import Chatbot from "@/components/Chatbot";

export const metadata = {
  title: "FreshPulse",
  description: "Fresh produce delivered to your doorstep",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          {children}
          <Chatbot cartId="default-cart" />
        </Providers>
      </body>
    </html>
  );
}
