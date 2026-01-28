import "./App.css";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import logo from "./logo.svg";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { incremented, amountAdded } from "./features/counter/counterSlice";
import { useFetchBreedsQuery } from "./features/dogs/dogsSlice";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";

export const App = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(incremented());
    dispatch(amountAdded(5));
  }

  // const { data = [], isFetching } = useFetchBreedsQuery(count);

  return (
    <>
      <ToastContainer /> 
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/signup" element={ <Signup /> } />
      </Routes>
    </>
  );
}