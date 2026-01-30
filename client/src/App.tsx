import "./App.css";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import BlogForm from "./pages/blogForm/blogForm";

export const App = () => {
  return (
    <>
      <ToastContainer /> 
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/signup" element={ <Signup /> } />
        <Route path="/add-blog" element={ <BlogForm/> } />
      </Routes>
    </>
  );
}