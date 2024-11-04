import Header from "@/components/Layout/User/Header";
import banner from "../assets/asdq.svg";
import Image from "next/image";
import "./page.module.css";

export default async function Home() {
  return (
    <>
      <Header />
      <div>
        <div className="hero-container bggray" id="hero-sec">
          <div className="container">
            <div className="row d-flex align-items-center">
              <div className="col">
                <div className="px-5 py-5 mt-5">
                  <div className="px-2 py-2 align-middle">
                    <h4 className="f-32 semi-bold">
                      Evaluate your compensation for free. It&apos;s simple, quick
                      and without obligation.
                    </h4>
                    <div className="simplyfied d-flex align-items-center gap-2 my-4">
                      <span className="border-is">Simplified Procedures</span>
                      <span className="border-is">Maximized Compensation</span>
                      <span className="border-is">100% Satisfied</span>
                    </div>
                    <p className="f-14">
                      In just a few clicks, you will find out if you are
                      entitled to compensation and how much you could receive.
                    </p>
                  </div>
                  <div className="px-2 py-2">
                    <button type="button" className="btn lanidng-btn">
                      Start Your Free Evaluation
                    </button>
                  </div>
                </div>
              </div>
              <div className="col align-middle">
                <div className="px-2 py-2">
                  <Image src={banner} className="img-fluid" alt="..." />
                </div>
              </div>
            </div>
          </div>
          <div className="hero_circle"></div>
          <div className="hero_box"></div>
        </div>
        {/* main container */}
        <div className="main-container familair-issues">
          <div className="container">
            <h2 className="text-center pb-5">
              Do these issues sound familiar?
            </h2>
            <div className="row justify-content-center">
              <div className="col-12 col-md-6 col-xl-4 mb-4">
                <div className="familiar-card">
                  <div className="ussie-count">1</div>
                  <h4>Justice is long and uncertain.</h4>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-4 mb-4">
                <div className="familiar-card">
                  <div className="ussie-count">2</div>
                  <h4>High costs of litigation limiting access to justice.</h4>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-4 mb-4">
                <div className="familiar-card">
                  <div className="ussie-count">3</div>
                  <h4>
                    Unequal balance of power against better armed and better
                    financed adversaries.
                  </h4>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-4 mb-4">
                <div className="familiar-card">
                  <div className="ussie-count">4</div>
                  <h4>
                    Lack of resources to effectively manage the volume of your
                    disputes.
                  </h4>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-4 mb-4">
                <div className="familiar-card">
                  <div className="ussie-count">5</div>
                  <h4>
                    Cash flow difficulties due to the immobilization of funds in
                    legal proceedings.
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        {/*  Finance litigation  */}
        <div className="finance-liti" id="finance">
          <div className="container">
            <div className="row center mx-4 my-4">
              <p className="f-18">Don&apos;t worry</p>
              <h2>
                We can{" "}
                <span style={{ color: "#00df9a" }}>
                  {" "}
                  finance your litigation{" "}
                </span>{" "}
              </h2>
              <p className="f-18">So you don&apos;t have to</p>
            </div>
            <div className="row mb-5">
              <div className="col ">
                <div
                  className="card-assesment rounded p-5 h-100"
                  style={{ background: "#fffae8" }}
                >
                  <img
                    src="https://img.freepik.com/free-vector/work-time-concept-illustration_114360-1474.jpg?w=740&t=st=1667038053~exp=1667038653~hmac=7f51a4d7c9f7dc9e0e3a6d53d45f381fc455e5424bcc36a0bedca65db24487e7"
                    className="card-img-top object-fit-contain m-auto"
                    style={{ height: 120 }}
                    alt="..."
                  />
                  <div className="card-body text-center mt-4">
                    <h5 className="card-title">Free Initial Assessment</h5>
                    <p className="card-text f-14 pt-3">
                      Benefit from a precise and personalized analysis of your
                      file, all free of charge and without obligation.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col   ">
                <div
                  className="card-assesment text-center rounded p-5 h-100"
                  style={{ background: "#e3ffe5" }}
                >
                  <img
                    src="https://img.freepik.com/free-vector/work-time-concept-illustration_114360-1074.jpg"
                    className="card-img-top object-fit-contain m-auto"
                    style={{ height: 120 }}
                    alt="..."
                  />
                  <div className="card-body  mt-4">
                    <h5 className="card-title">
                      Complete Preparation of your File
                    </h5>
                    <p className="card-text f-14 pt-3">
                      Benefit from a solid legal strategy combined with
                      continuous monitoring and transparent communication for
                      optimal defense of your interests.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div
                  className="card-assesment   rounded p-5 text-center"
                  style={{ background: "#fdeeff" }}
                >
                  <img
                    src="https://img.freepik.com/free-vector/teaching-concept-illustration_114360-1708.jpg?w=740&t=st=1667038099~exp=1667038699~hmac=d144ede4a891a4bfcb57b109cc26614850ed35f5260bbf32541845325c476dbb"
                    className="card-img-top object-fit-contain m-auto"
                    style={{ height: 120 }}
                    alt="..."
                  />
                  <div className="card-body  mt-4">
                    <h5 className="card-title">
                      Rigorous and Tailor-made Defense of your Interests
                    </h5>
                    <p className="card-text f-14 pt-3">
                      Develop a tailor-made defense strategy in close
                      collaboration with our experts and actively participate in
                      every step of the process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-2 text-center">
                    <button type="button" className="btn lanidng-btn">
                      Start Your Free Evaluation
                    </button>
            </div>
          </div>
        </div>

        {/* overlay box */}
        {/*   <div class="mt-5 mx-1">
  <div class="card bg-black text-white ">
  <div class="card-body px-4 py-4">
    
    </div>
   </div>
  </div> */}
        {/*  banner container  */}
        {/* <div className="banner-container mt-5 mb-5" id="featured">
          <div className="container-fluid px-4 py-4">
            <div className="card bg-black text-white shadow-lg ">
              <h5 className="card-header">Featured Courses</h5>
              <div className="card-body">
            
                <div className="conatiner">
                  <div className="row d-flex justify-content-around">
                    <div className="col">
                      <div className="card text-black move-up mb-3">
                        <div className="card-header">Web Development</div>
                        <div className="card-body">
                          <h5 className="card-title">Front End + Backend</h5>
                          <p className="card-text">
                            Some quick example text to build on the card title
                            and make up the bulk of the card&apos;s content.
                          </p>
                              <a href="#" class="btn btn-outline-primary center">View our curriculum</a>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card text-black move-up mb-3">
                        <div className="card-header">Web3.0</div>
                        <div className="card-body">
                          <h5 className="card-title">Web3 and Tools</h5>
                          <p className="card-text">
                            Some quick example text to build on the card title
                            and make up the bulk of the card&apos;s content.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card text-black move-up mb-3">
                        <div className="card-header">Java Masterclass</div>
                        <div className="card-body">
                          <h5 className="card-title">Begineer Course</h5>
                          <p className="card-text">
                            Some quick example text to build on the card title
                            and make up the bulk of the card&apos;s content.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card text-black move-up mb-3">
                        <div className="card-header">Python </div>
                        <div className="card-body">
                          <h5 className="card-title">Python AI</h5>
                          <p className="card-text">
                            Some quick example text to build on the card title
                            and make up the bulk of the card&apos;s content.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* footer */}
        <div className="footer-container foot">
          <div className="container-fluid">
            <footer>
              <div className="">
                <div className="row">
                  <div className="col-12 col-md-4 footer-column">
                    <ul className="nav flex-column">col-md-4 box
                      <li className="nav-item">
                        <span className="footer-title">Product</span>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          Product 1
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          Product 2
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          Plans &amp; Prices
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          Frequently asked questions
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4 footer-column">
                    <ul className="nav flex-column">
                      <li className="nav-item">
                        <span className="footer-title">Company</span>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          About us
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          Job postings
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          News and articles
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4 footer-column">
                    <ul className="nav flex-column">
                      <li className="nav-item">
                        <span className="footer-title">
                          Contact &amp; Support
                        </span>
                      </li>
                      <li className="nav-item">
                        <span className="nav-link">
                          <i className="fas fa-phone" />
                          +47 45 80 80 80
                        </span>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="fas fa-comments" />
                          Live chat
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="fas fa-envelope" />
                          Contact us
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="fas fa-star" />
                          Give feedback
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="text-center">
                  <i className="fas fa-ellipsis-h" />
                </div>
                {/* <div className="row text-center">
                  <div className="col-md-4 box">
                    <span className="copyright quick-links">
                      Copyright © Your Website
                    </span>
                  </div>
                  <div className="col-md-4 box">
                    <ul className="list-inline social-buttons">
                      <li className="list-inline-item">
                        <a href="#">
                          <i className="fab fa-twitter" />
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a href="#">
                          <i className="fab fa-facebook-f" />
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a href="#">
                          <i className="fab fa-linkedin-in" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4 box">
                    <ul className="list-inline quick-links">
                      <li className="list-inline-item">
                        <a href="#">Privacy Policy</a>
                      </li>
                      <li className="list-inline-item">
                        <a href="#">Terms of Use</a>
                      </li>
                    </ul>
                  </div>
                </div> */}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
