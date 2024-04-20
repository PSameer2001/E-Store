import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import "../css/Profile.css";
import useLogOut from "../Hooks/useLogOut";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loader from "../components/Loader";
import Image from "react-bootstrap/Image";

const Profile = (props) => {
  const authUser = props.authUser;
  const currentUser = authUser.state;

  const { logout } = useLogOut();
  const navigate = useNavigate();

  const LogOut = async () => {
    try {
      const res = await logout();
      if (res === "logout") {
        toast.success("Logout Successful", { duration: 1000 });
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      } else {
        toast.error(res, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [passwordType, setPasswordType] = useState("password");
  const [isGeneralLoading, setIsGeneralLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [user, setUser] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    address: currentUser.address,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [image, setImage] = useState(currentUser.imageUrl);

  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const onlyNumber = (e) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      if (e.target.value.length < 11) {
        setUser({ ...user, phone: e.target.value });
      }
    }
  };

  const UpdateData = async (e) => {
    e.preventDefault();
    try {
      setIsGeneralLoading(true);
      var formData = new FormData(e.target);
 
      let formObject = Object.fromEntries(formData.entries());
      // console.log(formObject);

      const res = await axios.post(`${process.env.SERVER_URL}/updateUser`, formObject);
      let message = res.data.message;

      if (message === "success") {
        setIsGeneralLoading(false);
        toast.success("Update Successful", { duration: 1500 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const UpdatePassword = async () => {
    try {
      const { email, currentPassword, newPassword, confirmNewPassword } = user;

      if (
        currentPassword === "" ||
        newPassword === "" ||
        confirmNewPassword === ""
      ) {
        toast.error("All fields are Mandatory", { duration: 1000 });
        return false;
      }

      if (newPassword !== confirmNewPassword) {
        toast.error("New Password and Confirm Password Not Match", {
          duration: 1500,
        });
        return false;
      }

      setIsPasswordLoading(true);
      const res = await axios.post(`${process.env.SERVER_URL}/updatePassword`, {
        email,
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      let message = res.data.message;

      if (message === "success") {
        setIsPasswordLoading(false);
        toast.success("Update Successful", { duration: 1500 });
      } else {
        setIsPasswordLoading(false);
        toast.error(message, {
          duration: 1500,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlefileUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    var formData = new FormData();
    formData.append("imageUrl", file);
    formData.append("email", currentUser.email);

    if (file != null) {
      // const filereader = new FileReader();
      // filereader.readAsDataURL(file);
      // filereader.onloadend = () => {
      //   // var res = String(filereader.result);
      // };
      const allowedType = ["image/jpeg","image/jpg","image/png","image/gif"];

      if(!allowedType.includes(file?.type)){
        toast.error("Only JPG, PNG and PNG file type are allowed", { duration: 1500 });
        return false;
      }
      const res = await axios.post(`${process.env.SERVER_URL}/updateProfilePhoto`, formData);
      let message = res.data.message;

      if (message === "success") {
        setImage(res.data.file);
        toast.success("Update Successful", { duration: 1500 });
      }else{
        toast.error("Something Went Wrong", { duration: 1500 });
      }
    }
  };

  return (
    <>
      <div className="ProfileContainer">
        <h4 className="font-weight-bold py-3 mb-2">Account settings</h4>

        <div className="card">
          <Tab.Container id="left-tabs-example" defaultActiveKey="general">
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column navpills">
                  <Nav.Item>
                    <Nav.Link eventKey="general">General</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="password_change">
                      Change Password
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="social">Social</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link onClick={LogOut}>
                      <span className="logout_btn">
                        Logout &nbsp;&nbsp;&nbsp;
                        <FontAwesomeIcon icon={faRightFromBracket} />
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="general">
                    <div className="card-body">
                      <h5>Update Profile</h5>
                      <br />
                      <form onSubmit={UpdateData}>
                        <div className="col-md-12">
                          <div className="profile_img">
                            <Image
                              src={`${process.env.IMAGE_URL}/profile/${image}`}
                              alt="Profile"
                              style={{ width: "8rem", height: "8rem" }}
                              rounded
                            />
                          </div>
                          <br />

                          <label htmlFor="image">Image</label>
                          <input
                            type="file"
                            name="imageUrl"
                            id="imageUrl"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) =>  handlefileUpload(e)}
                          />
                          <br />

                          <label htmlFor="name">Name</label>
                          <input
                            type="name"
                            name="name"
                            id="name"
                            className="form-control"
                            value={user.name}
                            onChange={handleInputs}
                            readOnly
                          />
                          <br />

                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="form-control"
                            value={user.email}
                            onChange={handleInputs}
                            readOnly
                          />
                          <br />

                          <label htmlFor="phone">Phone</label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            className="form-control"
                            value={user.phone}
                            onChange={onlyNumber}
                          />
                          <br />

                          <label htmlFor="address">Address</label>
                          <textarea
                            name="address"
                            id="address"
                            cols="10"
                            rows="5"
                            className="form-control"
                            value={user.address}
                            onChange={handleInputs}
                          ></textarea>
                          <br />

                          <button type="submit" id="update_btn">
                            {isGeneralLoading ? <Loader /> : "Update"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="password_change">
                    <div className="card-body">
                      <h5>Change Password</h5>
                      <br />

                      <label htmlFor="current_password">Current Password</label>
                      <div className="row">
                        <div className="col-sm-10">
                          <input
                            type={passwordType}
                            name="currentPassword"
                            id="current_password"
                            className="form-control"
                            value={user.currentPassword}
                            onChange={handleInputs}
                          />
                        </div>
                        <div className="col-sm-2">
                          <button
                            className="btn btn-outline-primary"
                            onClick={togglePassword}
                          >
                            {passwordType === "password" ? (
                              <FontAwesomeIcon icon={faEyeSlash} />
                            ) : (
                              <FontAwesomeIcon icon={faEye} />
                            )}
                          </button>
                        </div>
                      </div>
                      <br />

                      <div className="col-md-12">
                        <label htmlFor="new_password">New Password</label>
                        <input
                          type="text"
                          name="newPassword"
                          id="new_password"
                          className="form-control"
                          value={user.newPassword}
                          onChange={handleInputs}
                        />
                        <br />

                        <label htmlFor="confirm_new_password">
                          Confirm New Password
                        </label>
                        <input
                          type="text"
                          name="confirmNewPassword"
                          id="confirm_new_password"
                          className="form-control"
                          value={user.confirmNewPassword}
                          onChange={handleInputs}
                        />
                        <br />

                        <button
                          type="button"
                          onClick={UpdatePassword}
                          id="update_btn"
                        >
                          {isPasswordLoading ? <Loader /> : "Update"}
                        </button>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="social"></Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>

      {/* <div className="container light-style flex-grow-1 container-p-y">
        <h4 className="font-weight-bold py-3 mb-4">
            Account settings
        </h4>
        <div className="card overflow-hidden">
            <div className="row no-gutters row-bordered row-border-light">
                <div className="col-md-3 pt-0">
                    <div className="list-group list-group-flush account-settings-links">
                        <Link className="list-group-item list-group-item-action active" data-toggle="list" to="#account-general">General</Link>
                        <NavLink className="list-group-item list-group-item-action" data-toggle="list"
                            to="#account-change-password">Change password</NavLink>
                        <NavLink className="list-group-item list-group-item-action" data-toggle="list"
                            to="#account-info">Info</NavLink>
                        <a className="list-group-item list-group-item-action" data-toggle="list"
                            href="#account-social-links">Social links</a>
                        <NavLink className="list-group-item list-group-item-action" data-toggle="list"
                            to="#account-connections">Connections</NavLink>
                        <NavLink className="list-group-item list-group-item-action" data-toggle="list"
                            to="#account-notifications">Notifications</NavLink>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="tab-content">
                        <div className="tab-pane fade " id="account-general">
                            <div className="card-body media align-items-center">
                                <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="png"
                                    className="d-block ui-w-80" />
                                <div className="media-body ml-4">
                                    <label className="btn btn-outline-primary">
                                        Upload new photo
                                        <input type="file" className="account-settings-fileinput" />
                                    </label> &nbsp;
                                    <button type="button" className="btn btn-default md-btn-flat">Reset</button>
                                    <div className="text-light small mt-1">Allowed JPG, GIF or PNG. Max size of 800K</div>
                                </div>
                            </div>
                            <hr className="border-light m-0" />
                            <div className="card-body">
                                <div className="form-group">
                                    <label className="form-label">Username</label>
                                    <input type="text" className="form-control mb-1" value="nmaxwell" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-control" value="Nelle Maxwell" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">E-mail</label>
                                    <input type="text" className="form-control mb-1" value="nmaxwell@mail.com" readOnly/>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company</label>
                                    <input type="text" className="form-control" value="Company Ltd."/>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="account-change-password">
                            <div className="card-body pb-2">
                                <div className="form-group">
                                    <label className="form-label">Current password</label>
                                    <input type="password" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">New password</label>
                                    <input type="password" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Repeat new password</label>
                                    <input type="password" className="form-control"/>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="account-info">
                            <div className="card-body pb-2">
                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea className="form-control"
                                        rows="5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nunc arcu, dignissim sit amet sollicitudin iaculis, vehicula id urna. Sed luctus urna nunc. Donec fermentum, magna sit amet rutrum pretium, turpis dolor molestie diam, ut lacinia diam risus eleifend sapien. Curabitur ac nibh nulla. Maecenas nec augue placerat, viverra tellus non, pulvinar risus.</textarea>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Birthday</label>
                                    <input type="text" className="form-control" value="May 3, 1995"/>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Country</label>
                                    <select className="custom-select">
                                        <option>USA</option>
                                        <option selected>Canada</option>
                                        <option>UK</option>
                                        <option>Germany</option>
                                        <option>France</option>
                                    </select>
                                </div>
                            </div>
                            <hr className="border-light m-0" />
                            <div className="card-body pb-2">
                                <h6 className="mb-4">Contacts</h6>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input type="text" className="form-control" value="+0 (123) 456 7891"/>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Website</label>
                                    <input type="text" className="form-control" value />
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade active show" id="account-social-links">
                            <div className="card-body pb-2">
                                <div className="form-group">
                                    <label className="form-label">Twitter</label>
                                    <input type="text" className="form-control" value="https://twitter.com/user" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Facebook</label>
                                    <input type="text" className="form-control" value="https://www.facebook.com/user" /> 
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Google+</label>
                                    <input type="text" className="form-control" value />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">LinkedIn</label>
                                    <input type="text" className="form-control" value />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Instagram</label>
                                    <input type="text" className="form-control" value="https://www.instagram.com/user" />
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="account-connections">
                            <div className="card-body">
                                <button type="button" className="btn btn-twitter">Connect to
                                    <strong>Twitter</strong></button>
                            </div>
                            <hr className="border-light m-0" />
                            <div className="card-body">
                                <h5 className="mb-2">
                                    <NavLink to="/" className="float-right text-muted text-tiny"><i
                                            className="ion ion-md-close"></i> Remove</NavLink>
                                    <i className="ion ion-logo-google text-google"></i>
                                    You are connected to Google:
                                </h5>
                                <NavLink to="/cdn-cgi/l/email-protection" className="__cf_email__"
                                    data-cfemail="f9979498818e9c9595b994989095d79a9694">[email&#160;protected]</NavLink>
                            </div>
                            <hr className="border-light m-0" />
                            <div className="card-body">
                                <button type="button" className="btn btn-facebook">Connect to
                                    <strong>Facebook</strong></button>
                            </div>
                            <hr className="border-light m-0" />
                            <div className="card-body">
                                <button type="button" className="btn btn-instagram">Connect to
                                    <strong>Instagram</strong></button>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="account-notifications">
                            <div className="card-body pb-2">
                                <h6 className="mb-4">Activity</h6>
                                <div className="form-group">
                                    <label className="switcher">
                                        <input type="checkbox" className="switcher-input" checked />
                                        <span className="switcher-indicator">
                                            <span className="switcher-yes"></span>
                                            <span className="switcher-no"></span>
                                        </span>
                                        <span className="switcher-label">Email me when someone comments on my article</span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="switcher">
                                        <input type="checkbox" className="switcher-input" checked />
                                        <span className="switcher-indicator">
                                            <span className="switcher-yes"></span>
                                            <span className="switcher-no"></span>
                                        </span>
                                        <span className="switcher-label">Email me when someone answers on my forum
                                            thread</span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="switcher">
                                        <input type="checkbox" className="switcher-input" />
                                        <span className="switcher-indicator">
                                            <span className="switcher-yes"></span>
                                            <span className="switcher-no"></span>
                                        </span>
                                        <span className="switcher-label">Email me when someone follows me</span>
                                    </label>
                                </div>
                            </div>
                            <hr className="border-light m-0" />
                            <div className="card-body pb-2">
                                <h6 className="mb-4">Application</h6>
                                <div className="form-group">
                                    <label className="switcher">
                                        <input type="checkbox" className="switcher-input" checked />
                                        <span className="switcher-indicator">
                                            <span className="switcher-yes"></span>
                                            <span className="switcher-no"></span>
                                        </span>
                                        <span className="switcher-label">News and announcements</span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="switcher">
                                        <input type="checkbox" className="switcher-input" />
                                        <span className="switcher-indicator">
                                            <span className="switcher-yes"></span>
                                            <span className="switcher-no"></span>
                                        </span>
                                        <span className="switcher-label">Weekly product updates</span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="switcher">
                                        <input type="checkbox" className="switcher-input" checked  />
                                        <span className="switcher-indicator">
                                            <span className="switcher-yes"></span>
                                            <span className="switcher-no"></span>
                                        </span>
                                        <span className="switcher-label">Weekly blog digest</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="text-right mt-3">
            <button type="button" className="btn btn-primary">Save changes</button>&nbsp;
            <button type="button" className="btn btn-default">Cancel</button>
        </div>
    </div> */}
    </>
  );
};

export default Profile;
