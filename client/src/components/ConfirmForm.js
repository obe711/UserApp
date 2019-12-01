import React from "react";
import { Input, FormFeedback } from "reactstrap";

const ConfirmForm = ({
  email,
  password,
  passwordAgain,

  handleChange,
  handleSubmit,
  match
}) => {
  return (
    <div className="container login">
      <div className="row">
        <div className="col-lg-7 col-xl-3 align-items-center"></div>
        <div className="col-lg-7 col-xl-6 align-items-center">
          <div className="content">
            <div className="tab-heading">
              <h2 className="text-uppercase ">
                <span className="text-primary font-weight-bold ">Create</span>{" "}
                Password
              </h2>
            </div>

            <div className="tab-features ">
              <div className="tab-content px-6 py-7 " id="myTabContent">
                <div
                  className="tab-pane fade show active "
                  id="tours"
                  role="tabpanel"
                  aria-labelledby="tours-tab"
                >
                  <div className="container login ">
                    <form className="" action="" method="post">
                      <div className="row">
                        <div className="col-md-12">
                          <label for="exampleInputText">Enter Email</label>
                          <div className="form-group form-group-icon form-group-icon-default mb-6 ">
                            <i className="fa fa-user" aria-hidden="true"></i>
                            <Input
                              type="email"
                              className="form-control"
                              name="email"
                              placeholder="Email"
                              autoComplete="email"
                              value={email}
                              onChange={e => {
                                handleChange("email", e.target.value);
                              }}
                            ></Input>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <label for="exampleInputText">New Password</label>
                          <div className="form-group form-group-icon form-group-icon-default mb-6 ">
                            <i className="fa fa-lock" aria-hidden="true"></i>
                            <Input
                              type="password"
                              className="form-control"
                              name="password"
                              placeholder="Password"
                              autoComplete="new-password"
                              value={password}
                              onChange={e =>
                                handleChange("password", e.target.value)
                              }
                            ></Input>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <label for="exampleInputText">
                            Re-enter New Password
                          </label>
                          <div className="form-group form-group-icon form-group-icon-default mb-6 ">
                            <i className="fa fa-lock" aria-hidden="true"></i>
                            <Input
                              type="password"
                              className="form-control"
                              name="repassword"
                              placeholder="Re-enter Password"
                              autoComplete="off"
                              value={passwordAgain}
                              onChange={e =>
                                handleChange("passwordAgain", e.target.value)
                              }
                              error={
                                match === false ? "Passwords must match" : null
                              }
                              invalid={!match}
                            ></Input>
                            <FormFeedback>
                              {match === false ? "Passwords must match" : null}
                            </FormFeedback>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2">
                        <button
                          type="submit"
                          onClick={handleSubmit}
                          className="btn btn-lg btn-primary text-uppercase shadow-lg"
                        >
                          Search
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmForm;
