/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { API_ENDPOINT } from "../../config/constants";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";

type FormValues = {
    name: string;
    email: string;
    phone: string;
    password: string;
    address: string;
}


const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/users/register`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Sign-up failed");
      }

      const responseData = await response.json();
      console.log(responseData);
      toast.success("Sign-up successful!");

      localStorage.setItem("token", responseData.token);
      localStorage.setItem("userData", JSON.stringify(responseData.user));
      localStorage.setItem("userID", responseData.user.id)
      navigate("/signin");
    } catch (error) {
      console.error("Sign-up failed:", error);
      toast.error("Sign-up failed. Please check your information and try again.");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <ToastContainer />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          {t('Collaborative Blogging')}
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {t('Create an account')}
            </h1>
            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('Name')}</label>
                <input type="text" id="name" autoFocus {...register("name", { required: true, pattern: /^[a-zA-Z]+$/ })} className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.name ? "border-red-500" : ""}`} placeholder="First Name" />
                {errors.name && <span className="text-red-500">{t('Please enter a valid name')}</span>}
              </div>
              <div>
                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('Address')}</label>
                <input type="text" id="address" autoFocus {...register("address", { required: true })} className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.address ? "border-red-500" : ""}`} placeholder="Username" />
                {errors.address && <span className="text-red-500">{t('address is required')}</span>}
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('Email')}</label>
                <input type="email" id="email" autoFocus {...register("email", { required: true })} className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.email ? "border-red-500" : ""}`} placeholder="Email" />
                {errors.email && <span className="text-red-500">{t('Email is required')}</span>}
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('Mobile Number')}</label>
                <input type="tel" id="phone" autoFocus {...register("phone", { required: true, pattern: /^[0-9]{10}$/ })} className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.phone ? "border-red-500" : ""}`} placeholder="Mobile Number" />
                {errors.phone && <span className="text-red-500">{t('Please enter a valid 10-digit mobile number')}</span>}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('Password')}</label>
                <input type="password" id="password" autoFocus {...register("password", { required: true })} className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.password ? "border-red-500" : ""}`} placeholder="Password" />
                {errors.password && <span className="text-red-500">{t('Password is required')}</span>}
              </div>
              <button type="submit" className="col-span-2 w-full text-blue bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{t('Create an account')}</button>
            </form>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              {t('Already have an account?')} <a href="/signin" className="font-medium text-primary-600 hover:underline dark:text-primary-500">{t('Login here')}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupForm;