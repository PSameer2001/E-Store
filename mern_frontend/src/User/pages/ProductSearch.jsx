import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import '../css/ProductSearch.css'

const ProductSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const search_data = location.state;

  if (search_data === null || search_data === undefined) {
    navigate("/");
  }

  return (
    <>
      <div className="search_product">
        <Link to="/" className="previous" replace={true}>
          Back
        </Link>
        <section className="">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <header className="d-sm-flex align-items-center border-bottom mb-4 pb-3">
                  <strong className="d-block py-2">
                    {search_data.length} Items found{" "}
                  </strong>
                </header>

                {search_data.length !== 0 ? (
                  search_data.map((data) => {
                    return (
                      <div key={data.id}>
                        <div className="row justify-content-center mb-3">
                          <div className="col-md-12">
                            <div className="card shadow-0 border rounded-3">
                              <div className="card-body">
                                <div className="row g-0">
                                  <div className="col-xl-3 col-md-4 d-flex justify-content-center">
                                    <div className="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
                                      <img
                                        alt="img"
                                        src={`${data.image_src}`}
                                        className="w-100"
                                      />
                                      <a href="#!">
                                        <div className="hover-overlay">
                                          <div
                                            className="mask"
                                            style={{
                                              backgroundColor:
                                                "rgba(253, 253, 253, 0.15)",
                                            }}
                                          ></div>
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                  <div className="col-xl-6 col-md-5 col-sm-7">
                                    <h5>{data.name}</h5>
                                    <div className="d-flex flex-row">
                                      <div className="text-warning mb-1 me-2">
                                        <FontAwesomeIcon icon={faStar} />
                                        <FontAwesomeIcon icon={faStar} />
                                        <FontAwesomeIcon icon={faStar} />
                                        <FontAwesomeIcon icon={faStar} />
                                        <FontAwesomeIcon icon={faStarHalfAlt} />
                                        <span className="ms-1">4.5</span>
                                      </div>
                                      <span className="text-muted">
                                        ({data.orderCount} Ordered)
                                      </span>
                                    </div>

                                    <p className="text mb-4 mb-md-0">
                                      {data.description.slice(0, 180)}...
                                    </p>
                                  </div>
                                  <div className="col-xl-3 col-md-3 col-sm-5">
                                    <div className="d-flex flex-row justify-content-center mb-1">
                                      <h4 className="mb-1 me-1">
                                        {" "}
                                        &#8377;{" "}
                                        {new Intl.NumberFormat().format(
                                          data.price
                                        )}
                                      </h4>
                                      <span className="text-danger">
                                        <s
                                          style={{
                                            textDecorationLine: "line-through",
                                          }}
                                        >
                                          &#8377;{" "}
                                          {new Intl.NumberFormat().format(
                                            data.oldprice
                                          )}
                                        </s>
                                      </span>
                                    </div>
                                    <div
                                      className="mt-4"
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Link
                                        to={`/product_detail/${data.category}/${data.id}`}
                                      >
                                        <button
                                          className="btn btn-primary shadow-0"
                                          type="button"
                                        >
                                          Buy
                                        </button>
                                      </Link>
                                      <a
                                        href="#!"
                                        className="btn btn-light border px-2 pt-2 icon-hover"
                                      >
                                        <FontAwesomeIcon icon={faHeart} />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no_content">
                    <h3 className="font-weight-bold">No Products Available</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProductSearch;
