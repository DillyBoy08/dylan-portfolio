"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO at TechStart",
    company: "TechStart Inc.",
    image: "👩‍💼",
    text: "Dylan&apos;s work exceeded our expectations. The website he built is not only beautiful but also performs exceptionally well. His attention to detail and communication throughout the project was outstanding.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "InnovateCo",
    image: "👨‍💻",
    text: "Working with Dylan was a fantastic experience. He transformed our ideas into a sleek, modern web application that our users love. Highly recommend his services!",
    rating: 5,
  },
  {
    name: "Emma Williams",
    role: "Marketing Director",
    company: "BrandBoost",
    image: "👩‍🎨",
    text: "Dylan&apos;s expertise in modern web technologies really shines through. He delivered a responsive, fast-loading site that has significantly improved our conversion rates.",
    rating: 5,
  },
  {
    name: "David Martinez",
    role: "Founder",
    company: "StartupHub",
    image: "👨‍💼",
    text: "Professional, creative, and reliable. Dylan brought our vision to life with a stunning portfolio site that perfectly represents our brand. Couldn't be happier!",
    rating: 5,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-32 px-6 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            What Clients Say
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Testimonials from satisfied clients
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg mb-8 max-w-4xl mx-auto"
        >
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg">
              {testimonials[activeIndex].image}
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">
                  ⭐
                </span>
              ))}
            </div>

            {/* Quote */}
            <p className="text-xl text-gray-700 leading-relaxed mb-6 italic">
              &ldquo;{testimonials[activeIndex].text}&rdquo;
            </p>

            {/* Author */}
            <div>
              <h4 className="font-bold text-lg gradient-text">
                {testimonials[activeIndex].name}
              </h4>
              <p className="text-gray-600">
                {testimonials[activeIndex].role}
              </p>
              <p className="text-sm text-gray-500">
                {testimonials[activeIndex].company}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((testimonial, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setActiveIndex(index)}
              className={`bg-white rounded-2xl p-6 text-left transition-all hover:shadow-lg ${
                activeIndex === index
                  ? "ring-2 ring-purple-500 shadow-lg"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-sm truncate">
                    {testimonial.name}
                  </h5>
                  <p className="text-xs text-gray-500 truncate">
                    {testimonial.company}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {testimonial.text}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                activeIndex === index
                  ? "bg-purple-500 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
