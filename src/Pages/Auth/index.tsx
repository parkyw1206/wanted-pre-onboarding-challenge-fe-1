import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import logo from "../../shared/images/logo.png";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";

function AuthPage() {
  const navigate = useNavigate();

  const [inputAccount, changeInputAccount] = useState({
    email: "",
    password: "",
  });
  const [errorAccount, changeErrorAccount] = useState({
    email: false,
    password: false,
  });
  const [page, changePage] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  useEffect(() => {
    changeInputAccount({ email: "", password: "" });
    changeErrorAccount({ email: false, password: false });
  }, [page]);
  const changeAccountInput = (type: "email" | "password", value: string) => {
    const regexAccount = {
      email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      password: /^.{8,}$/,
    };
    changeInputAccount({ ...inputAccount, [type]: value });
    changeErrorAccount({
      ...errorAccount,
      [type]: !regexAccount[type].test(value),
    });
  };

  const handleLoginUser = () => {
    axios
      .post("http://localhost:8080/users/login", {
        email: inputAccount.email,
        password: inputAccount.password,
      })
      .then(function (response) {
        const responseData = response.data;
        toast.success(responseData.message);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${responseData.token}`;

        window.localStorage.setItem("token", responseData.token);
        navigate("/todo");
      })
      .catch((error) => {
        toast.error(error.response.data.details ?? "알 수 없는 오류");
      });
  };
  const handleSignupUser = () => {
    axios
      .post("http://localhost:8080/users/create", {
        email: inputAccount.email,
        password: inputAccount.password,
      })
      .then(function (response) {
        const responseData = response.data;
        toast.success(responseData.message);
        window.localStorage.setItem("token", responseData.token);
        changePage("LOGIN");
      })
      .catch((error) => {
        const errorResponse = error.response.data;
        toast.error(errorResponse.details ?? "알 수 없는 오류");
      });
  };

  const handlePressAuthSubmit = () => {
    return page === "LOGIN" ? handleLoginUser() : handleSignupUser();
  };
  const checkSubmitDisable = () => {
    return (
      inputAccount.email === "" ||
      inputAccount.password === "" ||
      errorAccount.email ||
      errorAccount.password
    );
  };
  return (
    <div className="auth">
      <div className="auth-body">
        <img height={18} width={100} src={logo} alt="logo" />
        <span className="auth-titleTypo">프리온보딩 프론트엔드 챌린지 1월</span>
        <span className="auth-loginTypo">
          {page === "SIGNUP" ? "Sign Up" : "Login"}
        </span>
        <input
          placeholder="이메일을 입력해주세요."
          className="auth-input"
          value={inputAccount.email}
          onChange={(e) => changeAccountInput("email", e.target.value)}
        />
        <span className="auth-error">
          {errorAccount.email ? "이메일 형식이 유효하지않습니다." : ""}
        </span>
        <input
          placeholder="비밀번호를 입력해주세요."
          className="auth-input"
          value={inputAccount.password}
          onChange={(e) => changeAccountInput("password", e.target.value)}
          type={"password"}
        />
        <span className="auth-error">
          {errorAccount.password ? "비밀번호는 8자 이상이여야합니다." : ""}
        </span>
        <button
          className="auth-submitBtn"
          disabled={checkSubmitDisable()}
          onClick={() => handlePressAuthSubmit()}
        >
          {page === "SIGNUP" ? "회원 가입" : "로그인"}
        </button>

        <span
          className="auth-signup"
          onClick={() => changePage(page === "LOGIN" ? "SIGNUP" : "LOGIN")}
        >
          {page === "LOGIN" ? "회원가입하기" : "로그인하기"}
        </span>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AuthPage;
