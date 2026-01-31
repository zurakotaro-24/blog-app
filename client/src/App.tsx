import "./App.css";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import BlogForm from "./pages/blogForm/blogForm";
import UserBlogs from "./pages/userBlogs/userBlogs";
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewBlog from "./pages/viewBlog/viewBlog";

export const App = () => {
  return (
    <>
      <ToastContainer 
        position="top-left" 
      /> 
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/signup" element={ <Signup /> } />
        <Route path="/add-blog" element={ <BlogForm/> } />
        <Route path="/user-blogs" element={  <UserBlogs /> } />
        <Route path="/blogs/:id" element={ <ViewBlog/> } />
      </Routes>
    </>
  );
}