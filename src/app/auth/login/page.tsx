import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LoginComponent from "./_login";
import { Metadata } from "next";
import Link from "next/link";
import AnimateAuth from "@/components/Animate/AnimateAuth";
import "./login.css";
import logo from "@/assets/login.png";
import Image from "next/image";
import { Button } from "@mui/material";
import google from "@/assets/google.png";
import git from "@/assets/git.png";
import linkedin from "@/assets/linkedin.png";
import facebook from "@/assets/facebook.png";

export const metadata: Metadata = {
  title: "Login",
  description: "Generated by create next app",
};

export default function Login() {
  return (
    <AnimateAuth>
      <section className="login-section">
        <div className="row login-main-r align-items-center">
          <div className="col-12 col-md-6 col-lg-6 login-background relative">
            <div className="login-img relative">
              <Image src={logo} className=" " alt="login-icon" />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-6">
            <div className="login-form pt-4 pb-3 px-5">
              <h2 className="bold">Welcome Back!</h2>
              <h2 className="bold pb-3">
                Empowering Legal Solutions: Join Our Tech-Driven Platform Today
              </h2>
              <Card elevation={5} style={{ boxShadow: "none" }}>
                <CardContent className="p-0">
                  <LoginComponent />
                </CardContent>
              </Card>
              <div className="login-or pt-4 relative text-center">
                <span className="dark bold">Or</span>
              </div>
              <div className="other-logins">
                <Button variant="outlined" type="submit">
                  <Image src={google} className=" " alt="google-icon" /> Login
                  with Google
                </Button>
                <Button variant="outlined" type="submit">
                  <Image src={git} className=" " alt="google-icon" />
                  Login with Github
                </Button>
                <Button variant="outlined" type="submit">
                  <Image src={linkedin} className=" " alt="google-icon" />
                  Login with Linkedin
                </Button>
                <Button variant="outlined" type="submit">
                  <Image src={facebook} className=" " alt="google-icon" />
                  Login with Facebook
                </Button>
              </div>
              <Typography className="mt-3 f-13" textAlign="center">
              No Account yet? 
                <Link href="/auth/register" className="f-13 dark bold"> SIGN UP</Link>
              </Typography>
            </div>
          </div>
        </div>
      </section>
    </AnimateAuth>
  );
}
