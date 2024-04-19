import React from "react";
import { Link } from "react-router-dom";
// import { FaFacebook } from "react-icons/fa";
import { SocialIcon } from "react-social-icons";
import '../css/Footer.css'

const Footer = () => {
  const style = {
    width: "30px",
    height: "30px",
  };

  return (
    <div className="container-fluid" style={{ padding: 0 }}>
      <footer
        className="text-center text-lg-start text-white"
        style={{ backgroundColor: "#948787" }}
      >
        <section
          className="d-flex justify-content-between p-3"
          style={{ backgroundColor: "rgb(255 197 121)" }}
        >
          <div className="me-2">
            <span>Get connected with us on social networks:</span>
          </div>

          <div>
            {/* <FaFacebook  style={{color: "blue"}}/> */}

              <SocialIcon
                network="facebook"
                className="social_icon"
                style={style}
                href="/"
              />

            <SocialIcon
              network="twitter"
              className="social_icon"
              style={style}
              href="/"
            />

            <SocialIcon
              network="google"
              className="social_icon"
              style={style}
              href="/"
            />

            <SocialIcon
              network="instagram"
              className="social_icon"
              style={style}
              href="/"
            />

            <SocialIcon
              network="linkedin"
              className="social_icon"
              style={style}
              href="/"
            />

            <SocialIcon
              network="github"
              className="social_icon"
              style={style}
              href="/"
            />
          </div>
        </section>

        <section className="links_details">
          <div className="container text-center text-md-start mt-1">
            <div className="row mt-2">
              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-1">
                <h6 className="text-uppercase fw-bold webh6">E-Store</h6>
                <hr
                  className="mt-0  mx-auto"
                  style={{
                    backgroundColor: "#7c4dff",
                    height: "2px",
                    width: "60px",
                  }}
                />
                <p>
                  A website we have launched with full of shopping products and
                  gadgets with offers and discount.
                </p>
              </div>

              <div className="col-md-2 col-lg-2 col-xl-2 mx-auto">
                <h6 className="text-uppercase fw-bold ph6" >Products</h6>
                <hr
                  className="mt-0  mx-auto"
                  style={{
                    backgroundColor: "#7c4dff",
                    height: "2px",
                    width: "60px",
                  }}
                />
                <p>
                  <Link to="/" className="text-white">
                    Mobiles
                  </Link>
                </p>
                <p>
                  <Link to="/" className="text-white">
                    Accessories
                  </Link>
                </p>
                <p>
                  <Link to="/" className="text-white">
                    Audio
                  </Link>
                </p>
                <p>
                  <Link to="/" className="text-white">
                    Smart Watch
                  </Link>
                </p>
              </div>

              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-2">
                <h6 className="text-uppercase fw-bold">Useful links</h6>
                <hr
                  className="mt-0  mx-auto"
                  style={{
                    backgroundColor: "#7c4dff",
                    height: "2px",
                    width: "60px",
                  }}
                />
                <p>
                  <Link to="/" className="text-white">
                    Home
                  </Link>
                </p>
                <p>
                  <Link to="/" className="text-white">
                    About
                  </Link>
                </p>
                <p>
                  <Link to="/" className="text-white">
                    Contact
                  </Link>
                </p>
                <p>
                  <Link to="/admin" className="text-white">
                    Admin
                  </Link>
                </p>
              </div>

              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold">Contact</h6>
                <hr
                  className="mt-0  mx-auto"
                  style={{
                    backgroundColor: "#7c4dff",
                    height: "2px",
                    width: "60px",
                  }}
                />
                <p>
                  <i className="fas fa-home mr-3"></i> INDIA, TH 400612, IN
                </p>
                <p>
                  <i className="fas fa-envelope mr-3"></i>{" "}
                  panigrahisameer@example.com
                </p>
                <p>
                  <i className="fas fa-phone mr-3"></i> + 91 9878987634
                </p>
                <p>
                  <i className="fas fa-print mr-3"></i> + 91 9878987634
                </p>
              </div>
            </div>
          </div>
        </section>

        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          © 2023 Copyright : 
          <Link className="text-white" to="/">
            E-Store
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
