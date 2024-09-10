import * as React from "react";
import {
  Html,
  Button,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components";

interface AuthEmailProps {
  loginToken: string;
  questionId?: string;
}

export function AuthEmail({ loginToken, questionId }: AuthEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const authLink = `${baseUrl}/verify-token?token=${loginToken}&questionId=${
    questionId || ""
  }`;

  return (
    <Html lang="en">
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Text style={titleStyle}>Welcome to Our Metaverse Classroom</Text>
          <Text style={paragraphStyle}>
            Click the button below to log in and continue your learning journey:
          </Text>
          <Button href={authLink} style={buttonStyle}>
            Log In
          </Button>
          <Text style={paragraphStyle}>
            After logging in, you&apos;ll be redirected to your previous
            question:
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Arial, sans-serif",
};

const containerStyle = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const titleStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const paragraphStyle = {
  fontSize: "18px",
  lineHeight: "26px",
};

const buttonStyle = {
  backgroundColor: "#5469d4",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};
