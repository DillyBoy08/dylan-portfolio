"use client";

import { motion } from "framer-motion";
import { useState, useId } from "react";

function IconWarning() {
  return (
    <svg aria-hidden="true" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg aria-hidden="true" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default function Contact() {
  const statusId = useId();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setErrors({});

      // Reset form after 5 seconds — enough time to read on mobile
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setIsSubmitting(false);
      setErrors({
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  return (
    <section id="contact" className="py-32 px-6 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Advanced gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-100 via-transparent to-transparent dark:from-purple-950 opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-950 opacity-50"></div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-blue-400 dark:from-purple-600 dark:to-blue-600 rounded-full opacity-20 blur-3xl"
        ></motion.div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 dark:from-white dark:via-purple-100 dark:to-white bg-clip-text text-transparent pb-2">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
            Have a project in mind? Let&apos;s work together
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group"
        >
          <div className="relative bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-slate-900 dark:via-purple-950/30 dark:to-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-500 overflow-hidden">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-blue-500/5 group-hover:to-purple-500/5 transition-all duration-700 pointer-events-none"></div>

            {/* Animated border gradient */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-20 blur-2xl"></div>
            </div>
          {/* Screen reader announcement for form status */}
          <div id={statusId} role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {submitSuccess ? "Your message has been sent successfully." : ""}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div>
              <label htmlFor="name" className="block text-gray-800 dark:text-gray-200 font-bold mb-3 text-sm uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-6 py-4 rounded-2xl border-2 ${errors.name ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-950/20' : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950'} text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900/50 transition-all duration-300 hover:border-gray-400 dark:hover:border-slate-500 text-base`}
                placeholder="Your name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="name-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                >
                  <IconWarning /> {errors.name}
                </motion.p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-800 dark:text-gray-200 font-bold mb-3 text-sm uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-6 py-4 rounded-2xl border-2 ${errors.email ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-950/20' : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950'} text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900/50 transition-all duration-300 hover:border-gray-400 dark:hover:border-slate-500 text-base`}
                placeholder="your.email@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="email-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                >
                  <IconWarning /> {errors.email}
                </motion.p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-gray-800 dark:text-gray-200 font-bold mb-3 text-sm uppercase tracking-wide">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className={`w-full px-6 py-4 rounded-2xl border-2 ${errors.message ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-950/20' : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950'} text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900/50 transition-all duration-300 hover:border-gray-400 dark:hover:border-slate-500 resize-none text-base`}
                placeholder="Tell me about your project..."
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="message-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                >
                  <IconWarning /> {errors.message}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              whileHover={{ scale: isSubmitting || submitSuccess ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting || submitSuccess ? 1 : 0.98 }}
              className={`relative w-full px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden ${
                submitSuccess
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl shadow-green-500/50"
                  : "bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:from-purple-500 hover:via-blue-500 hover:to-purple-500"
              } ${isSubmitting || submitSuccess ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              {/* Animated shine effect */}
              {!submitSuccess && (
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
                </div>
              )}

              <span className="relative z-10">
                {isSubmitting && (
                  <span className="inline-flex items-center gap-3">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                )}
                {submitSuccess && (
                  <span className="inline-flex items-center gap-2 text-xl">
                    <IconCheck /> Message Sent!
                  </span>
                )}
                {!isSubmitting && !submitSuccess && (
                  <span className="inline-flex items-center gap-2">
                    Send Message
                    <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                )}
              </span>
            </motion.button>
          </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
