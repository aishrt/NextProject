import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import RegisterComponent from "./_register";
import { Metadata } from "next";
import Link from "next/link";
import AnimateAuth from "@/components/Animate/AnimateAuth";
import Image from "next/image";
import logo from "@/assets/logo.png";
import "../../login/login.css";
import { Button } from "@mui/material";
import google from "@/assets/google.png";
import twitt from "@/assets/twitter.png";
import facebook from "@/assets/facebook.png";
import apple from "@/assets/apple.png";
import loginbg from "@/assets/loginbg.png";
import female from "@/assets/female.png";

export const metadata: Metadata = {
  title: "Register",
  description: "Generated by create next app",
};

export default function Register() {
  return (
    <AnimateAuth>
      <section className="login-section">
        <div className="row login-main-r align-items-center">
          <div className="col-12 col-md-12 col-lg-6 relative">
            <div
              className="login-img  login-background  text-white relative "
              style={{
                backgroundImage: `url(${loginbg.src})`,
              }}
            >
              <Image src={logo} className="login-logo" alt="logo" />
              <h2 className="f-52 semi-bold pt-4">
                Empowering <br></br> Legal Solutions
              </h2>
              <p className="f-15">Join Our Tech-Driven Platform Today </p>
            </div>
            <div className="login-abs-icon">
              <Image src={female} className="female" alt="logo" />
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-6">
            <div className="login-form p-5">
              <div className="login-title d-flex justify-content-between align-items-center pb-4">
                <h2 className="bold f-52"> Register your Account</h2>
                <div className="text-end">
                  <h5 className="f-14 mb-0">Have an account </h5>
                  <Link href="/auth/client/login" className="bold dark f-14">
                    Login
                  </Link>
                </div>
              </div>
              <Card elevation={5} style={{ boxShadow: "none" }}>
                <CardContent className="p-0">
                  <RegisterComponent />
                </CardContent>
              </Card>

              <div className="relative mt-5">
                <p className="relative login-or  mb-0 text-center">
                  <span className="f-14 semi-bold">Or Continue With</span>
                </p>
              </div>
              <ul className="login-social d-flex align-items-center gap-3 justify-content-center pt-4">
                <li>
                  <Link href="#">
                    <Image src={google} alt="" />
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <Image src={twitt} alt="" />
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <Image src={facebook} alt="" />
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <Image src={apple} alt="" />
                  </Link>
                </li>
              </ul>
              {/* <Typography className="mt-3 f-13" textAlign="center">
                Own an Account?{" "}
                <Link href="/auth/login" className="f-13 dark bold">
                  JUMP RIGHT IN
                </Link>
              </Typography> */}
            </div>
          </div>
        </div>
      </section>
    </AnimateAuth>
  );
}
