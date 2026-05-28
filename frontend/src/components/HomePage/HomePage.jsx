import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";

const HomePage = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(false);
  };
  return (
    <div className="min-h-screen text-gray-800 ">
      <nav className="fixed w-full z-50 nav-blur shadow-sm animate__animated animate__fadeInDown">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-red-500">FoodieExpress</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="about"
                smooth={true}
                duration={500}
                href="#"
                className="text-gray-700 hover:text-red-500 transition font-medium"
              >
                About
              </Link>
              <Link
                to="contact"
                smooth={true}
                duration={500}
                href="#"
                className="text-gray-700 hover:text-red-500 transition font-medium"
              >
                Contact
              </Link>
              <RouterLink to="/login">
                <button
                  type="submit"
                  class="px-4 py-2 text-red-500 font-medium hover:bg-red-200 rounded-full transition cursor-pointer"
                >
                  Login
                </button>
              </RouterLink>
              <RouterLink to="/register">
                <button className="px-6 py-2 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition shadow-lg hover:shadow-xl cursor-pointer">
                  Signup
                </button>
              </RouterLink>
            </div>

            <button
              className="md:hidden focus:outline-none"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <svg
                  className="w-6 h-6 text-red-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              )}
            </button>
          </div>
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className=" grid pt-4 pb-2 space-y-3 text-center">
              <Link
                to="about"
                smooth={true}
                duration={500}
                className="block px-3 py-2 text-gray-700 hover:text-red-500 transition font-medium cursor-pointer"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                to="contact"
                smooth={true}
                duration={500}
                className="block px-3 py-2 text-gray-700 hover:text-red-500 transition font-medium cursor-pointer"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <RouterLink to="/login">
                <button
                  type="submit"
                  class="px-4 py-2 text-red-500 font-medium hover:bg-red-50 rounded-full transition cursor-pointer"
                >
                  Login
                </button>
              </RouterLink>

              <RouterLink to="/signup">
                <button className="px-6 py-2 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition shadow-lg hover:shadow-xl cursor-pointer">
                  Signup
                </button>
              </RouterLink>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero-gradient pt-32 pb-20 text-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Order food from your{" "}
                <span className="text-yellow-300">favorite</span> restaurants
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Discover the best food & drinks in your city. Fast delivery to
                your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href="#"
                  className="px-8 py-3 bg-white text-red-500 font-bold rounded-full hover:bg-gray-100 transition shadow-lg flex items-center justify-center pulse-ring"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                  Find Restaurants
                </a>
                <RouterLink
                  to="/login"
                  href="#"
                  className="px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-red-500 transition"
                >
                  Hurry Up!
                </RouterLink>
              </div>
            </motion.div>
          </div>
          <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="https://t3.ftcdn.net/jpg/03/51/02/46/360_F_351024684_qRJBZa0XlvKs5bKDHVqlcbVF2ux4tDga.jpg"
                alt="Delicious Food"
                className="w-full max-w-lg mx-auto rounded-xl shadow-2xl transform rotate-1"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Popular Cities
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <motion.div whileHover={{ scale: 1.05 }} className="city-card">
                <div className="bg-gray-100 rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="font-medium">Kathmandu</h3>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <div className="bg-gray-100 rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="font-medium">Pokhara</h3>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <div className="bg-gray-100 rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="font-medium">Hetauda</h3>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <div className="bg-gray-100 rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="font-medium">Butwal</h3>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <div className="bg-gray-100 rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="font-medium">Lalitpur</h3>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <div className="bg-gray-100 rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="font-medium">Dang</h3>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">
                Get the Foodie <span className="text-red-500">App</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Download our app for faster ordering, exclusive deals, and a
                better experience.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-800 transition"
                >
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"></path>
                  </svg>
                  App Store
                </a>
                <a
                  href="#"
                  className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-800 transition"
                >
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path>
                  </svg>
                  Google Play
                </a>
              </div>
            </motion.div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <img
                src="https://cdn.pixabay.com/photo/2017/01/22/12/07/imac-1999636_1280.png"
                alt="Mobile App"
                className="w-64 h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <motion.section
        className="py-16 bg-white"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6" id="about">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                alt="Our Team"
                className="rounded-xl shadow-xl "
              />
            </div>

            <div className="md:w-1/2 md:pl-12 ">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2020, Foodie began with a simple mission: make food
                delivery faster, more reliable, and more enjoyable. What started
                as a small team of food enthusiasts has grown into a platform
                serving millions of happy customers.
              </p>
              <p className="text-gray-600">
                We carefully select restaurant partners who share our commitment
                to quality, ensuring every meal meets our high standards for
                taste, freshness, and hygiene.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What You Can Expect</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Foodie offers more than just food delivery. Here's what makes our
              platform special:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="feature-card bg-white p-8 rounded-xl shadow-md transition duration-300">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Lightning Fast Delivery
                </h3>
                <p className="text-gray-600">
                  Average delivery time under 30 minutes with our optimized
                  routing system.
                </p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="feature-card bg-white p-8 rounded-xl shadow-md transition duration-300">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
                <p className="text-gray-600">
                  We vet all restaurant partners to ensure they meet our high
                  standards for food quality and hygiene.
                </p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="feature-card bg-white p-8 rounded-xl shadow-md transition duration-300">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Flexible Payment</h3>
                <p className="text-gray-600">
                  Multiple payment options including credit cards, digital
                  wallets, and cash on delivery.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div
        className=" bg-[url(https://t4.ftcdn.net/jpg/14/35/60/01/240_F_1435600184_63snT62Q0C0dU0PhtPkpq6mZoFkmumD4.jpg)] bg-cover bg-center"
        id="contact"
      >
        <div className="max-w-md mx-auto bg-white p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-red-500 mb-6">Get in Touch</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Message</label>
              <textarea
                rows="4"
                placeholder="Your message here..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition shadow-md hover:shadow-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-red-500 mb-4">Foodie</h3>
              <p className="text-gray-400 mb-4">
                Discover the best food & drinks in your city
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">About Foodie</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Culture
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Foodies</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Code of Conduct
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Verified Users
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Blogger Help
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Restaurants</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Add a Restaurant
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Business App
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Restaurant Widgets
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Products for Businesses
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2023 Foodie Technologies Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
