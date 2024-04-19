import React from "react";

import c1 from "./images/c1.png";
import c2 from "./images/c2.png";
import c3 from "./images/c3.png";
import c4 from "./images/c4.png";

const Gadgets = () => {
  return (
    <>
      <div className="heading">
        <h1>Gadgets</h1>
      </div>

      <div className="sub">
        <div className="catg-container">
          <div className="card">
            <div className="imgBx">
              <img src={c1} alt="" />
            </div>
            <div className="content1">
              <h2>Communication device</h2>
              <p> Mobile, Landline Phones, Wifi, Pc Etc</p>
              <a href="/" >
                open
              </a>
            </div>
          </div>
          <div className="card">
            <div className="imgBx">
              <img src={c2} alt="" />
            </div>
            <div className="content1">
              <h2>Home Appliances</h2>
              <p>Oven, Microwave, Dishwasher, TV Etc</p>
              <a href="/" >
                open
              </a>
            </div>
          </div>
          <div className="card">
            <div className="imgBx">
              <img src={c3} alt="" />
            </div>
            <div className="content1">
              <h2>Skin care products</h2>
              <p>Face washes, Creams & moisturizers, Body lotions Etc</p>
              <a href="/" >
                open
              </a>
            </div>
          </div>
          <div className="card">
            <div className="imgBx">
              <img src={c4} alt="" />
            </div>
            <div className="content1">
              <h2>Security products</h2>
              <p>Surveillance Cameras, Spy Pen , Electronic Cabinet Lock Etc</p>
              <a href="/" >
                open
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gadgets;
