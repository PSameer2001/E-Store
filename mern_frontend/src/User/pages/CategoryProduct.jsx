import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../css/CategoryProduct.css";
import Collapse from "react-bootstrap/Collapse";
import Accordion from "react-bootstrap/Accordion";
import useScreenSize from "../Hooks/useScreenSize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Badge from "react-bootstrap/Badge";

const CategoryProduct = () => {
  const [openfilter, setOpenFilter] = useState(true);
  const [products, setProducts] = useState([]);
  const [allproducts, setAllProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const screenSize = useScreenSize();

  const { category_id } = useParams();

  const getallProductData = async (category_id) => {
    const res = await axios.get(`/getallProductData/${category_id}`);
    const data = res.data;
    setAllProducts(data);
    setProducts(data);

    var brandData = [];
    data.forEach((resdata) => {
      const foundIndex = brandData.findIndex(
        (obj) => obj.brandName === resdata.brand
      );

      if (foundIndex === -1) {
        brandData.push({
          brandName: resdata.brand,
          brandCount: 1,
        });
      } else {
        brandData[foundIndex] = {
          brandName: brandData[foundIndex].brandName,
          brandCount: brandData[foundIndex].brandCount + 1,
        };
      }
    });

    setBrands(brandData);
  };

  useEffect(() => {
    getallProductData(category_id);
  }, [category_id]);

  useEffect(() => {
    if (screenSize.width > 768) {
      setOpenFilter(true);
    }
  }, [screenSize]);

  const [priceRange, setpriceRange] = useState({
    min: 0,
    max: 0,
  });
  const [priceRangeError, setpriceRangeError] = useState(false);
  const [priceRangeErrorValue, setpriceRangeErrorValue] = useState("");
  const [selectedCheckbox, setSelectedCheckBox] = useState([]);
  const [selectedRating, setSelectedRating] = useState([]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedCheckBox([...selectedCheckbox, value]);
    } else {
      setSelectedCheckBox(selectedCheckbox.filter((item) => item !== value));
    }
  };

  const handleCheckboxRating = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedRating([...selectedCheckbox, value]);
    } else {
      setSelectedRating(selectedCheckbox.filter((item) => item !== value));
    }
  };

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setpriceRange({ ...priceRange, [name]: value });
  };

  const handleFilter = () => {
    if (
      selectedCheckbox.length === 0 &&
      selectedRating.length === 0 &&
      priceRange.min === 0 &&
      priceRange.max === 0
    ) {
      setProducts([...allproducts]);
    } else {
      if (
        Number(priceRange.min) < Number(priceRange.max) &&
        Number(priceRange.max) !== 0
      ) {
        const filteredData2 = allproducts.filter(
          (obj) =>
            Number(obj.price) >= Number(priceRange.min) &&
            Number(obj.price) <= Number(priceRange.max)
        );
        setProducts(filteredData2);
      }else{
        setProducts(allproducts);
      }

      if (selectedCheckbox.length !== 0) {
        const filteredData = products.filter((obj) =>
          selectedCheckbox.includes(obj.brand)
        );
        setProducts(filteredData);
      }else{
        setProducts(allproducts);
      }
    }
  };

  const handleClearFilter = () => {
    setProducts([...allproducts]);
  };

  useEffect(() => {
    if (Number(priceRange.min) > Number(priceRange.max)) {
      setpriceRangeErrorValue("Invalid Range");
      setpriceRangeError(true);
    } else {
      setpriceRangeErrorValue("");
      setpriceRangeError(false);
    }
  }, [priceRange]);

  return (
    <>
      <div className="category_product">
        <Link to="/" className="previous" replace={true}>
          Back
        </Link>
        <section className="">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-3">
                <button
                  className="btn btn-outline-secondary mb-3 mt-3 w-100 d-lg-none d-md-none"
                  onClick={() => setOpenFilter(!openfilter)}
                  aria-controls="example-collapse-text"
                  aria-expanded={openfilter}
                >
                  <span>Show filter</span>
                </button>

                <Collapse in={openfilter}>
                  <Accordion defaultActiveKey="1">
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>Brands</Accordion.Header>
                      <Accordion.Body>
                        {brands.map((brand, i) => {
                          return (
                            <div className="form-check" key={brand.brandName}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={brand.brandName}
                                id={`flexCheckChecked1${i}`}
                                onChange={handleCheckboxChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`flexCheckChecked1${i}`}
                              >
                                {brand.brandName}
                              </label>
                              <Badge
                                bg="secondary"
                                style={{ marginLeft: "10px" }}
                                key={brand.brandName}
                              >
                                {brand.brandCount}
                              </Badge>
                            </div>
                          );
                        })}
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                      <Accordion.Header>Price</Accordion.Header>
                      <Accordion.Body>
                        <div className="row mb-3">
                          <div className="col-6">
                            <p className="mb-0">Min</p>
                            <div className="form-outline">
                              <input
                                type="number"
                                id="typeNumber"
                                name="min"
                                className="form-control"
                                onChange={handleInput}
                                value={priceRange.min}
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <p className="mb-0">Max</p>
                            <div className="form-outline">
                              <input
                                type="number"
                                id="typeNumber2"
                                name="max"
                                className="form-control"
                                onChange={handleInput}
                                value={priceRange.max}
                              />
                            </div>
                          </div>
                        </div>
                        {priceRangeError && (
                          <h6 className="text-danger">
                            {priceRangeErrorValue}
                          </h6>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                      <Accordion.Header>Ratings</Accordion.Header>
                      <Accordion.Body>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="rating5"
                            value="5"
                            onChange={handleCheckboxRating}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value="4"
                            id="rating4"
                            onChange={handleCheckboxRating}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value="3"
                            id="rating3"
                            onChange={handleCheckboxRating}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value="2"
                            id="rating2"
                            onChange={handleCheckboxRating}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value="1"
                            id="rating1"
                            onChange={handleCheckboxRating}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            <FontAwesomeIcon icon={faStar} />
                          </label>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    <button
                      type="button"
                      className="btn btn-primary mt-2 w-100 border border-secondary"
                      onClick={handleFilter}
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary mt-2 w-100 border border-secondary"
                      onClick={handleClearFilter}
                    >
                      Clear Filter
                    </button>
                  </Accordion>
                </Collapse>
              </div>

              <div className="col-lg-9 col-md-9">
                <header className="d-sm-flex align-items-center border-bottom mb-4 pb-3">
                  <strong className="d-block py-2">
                    {products.length} Items found{" "}
                  </strong>
                  <div className="ms-auto">
                    <select className="form-select d-inline-block w-auto border pt-1">
                      <option value="0">Best match</option>
                      <option value="1">Recommended</option>
                      <option value="2">High rated</option>
                      <option value="3">Randomly</option>
                    </select>
                  </div>
                </header>

                {products.length !== 0 ? (
                  products.map((data) => {
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

export default CategoryProduct;
