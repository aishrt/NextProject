"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
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
import DocUploadComponent from "@/app/container/documentUpload/_docUpload";


export default function DocumentUpload() {

  const handleFormSubmit =async()=>{


  }

  return (
    <AnimateAuth>
      <section className="login-section register-expert doc-expert">
        <div className="row login-main-r">
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
            <div className="login-form p-5 pe-0">
              <div className="login-title pb-4">
                <h2 className="f-52"> Document Upload</h2>
              
              </div>
              <Card elevation={5} style={{ boxShadow: "none" }}>
                <CardContent className="p-0">
                  <DocUploadComponent onFormSubmit={handleFormSubmit} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </AnimateAuth>
  );
}
