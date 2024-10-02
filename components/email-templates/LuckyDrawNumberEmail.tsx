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

interface LuckyDrawEmailProps {
  userEmail: string;
  luckyDrawNumber: string;
}

export function LuckyDrawEmail({
  userEmail,
  luckyDrawNumber,
}: LuckyDrawEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Text style={titleStyle}>CityU Metaverse Classroom Lucky Draw</Text>
          <Text style={paragraphStyle}>Dear participant,</Text>
          <Text style={paragraphStyle}>
            Thank you for participating in our Metaverse Classroom experience.
            Here are your details:
          </Text>
          <Text style={infoStyle}>
            Email: <span style={highlightStyle}>{userEmail}</span>
          </Text>
          <Text style={infoStyle}>
            Your Lucky Draw Number:{" "}
            <span style={highlightStyle}>{luckyDrawNumber}</span>
          </Text>
          <Text style={paragraphStyle}>
            Please keep this number for the upcoming lucky draw. Good luck!
          </Text>
          <Button href="https://www.cityu.edu.hk" style={buttonStyle}>
            Visit CityU Website
          </Button>
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
  color: "#4a4a4a",
};

const paragraphStyle = {
  fontSize: "18px",
  lineHeight: "26px",
  color: "#4a4a4a",
  marginBottom: "20px",
};

const infoStyle = {
  fontSize: "20px",
  lineHeight: "28px",
  color: "#4a4a4a",
  marginBottom: "10px",
};

const highlightStyle = {
  fontWeight: "bold",
  color: "#5469d4",
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
  padding: "14px",
  marginTop: "30px",
};
