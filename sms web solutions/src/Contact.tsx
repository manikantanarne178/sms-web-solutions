import { useState } from "react";
import "./contact.css";

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type Errors = {
  name?: string;
  email?: string;
  phone?: string;
};

const Contact = () => {

  // default phone with +91
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "+91",
    message: ""
  });

  const [errors, setErrors] = useState<Errors>({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // handle input change with live validation
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    const { name, value } = e.target;

    let updatedValue = value;

    // Phone validation: only numbers after +91
    if (name === "phone") {

      // remove +91 temporarily
      let numberPart = value.replace("+91", "");

      // allow only digits
      numberPart = numberPart.replace(/\D/g, "");

      // limit to 10 digits
      numberPart = numberPart.slice(0, 10);

      updatedValue = "+91" + numberPart;
    }

    const updatedForm = {
      ...formData,
      [name]: updatedValue
    };

    setFormData(updatedForm);

    // live validation
    let newErrors: Errors = { ...errors };

    if (name === "email") {
      if (!emailRegex.test(updatedValue)) {
        newErrors.email = "Enter valid email address";
      } else {
        delete newErrors.email;
      }
    }

    if (name === "phone") {
      if (updatedValue.length !== 13) {
        newErrors.phone = "Phone Number must be 10 digits";
      } else {
        delete newErrors.phone;
      }
    }

    if (name === "name") {
      if (updatedValue.trim().length < 3) {
        newErrors.name = "Name must be at least 3 characters";
      } else {
        delete newErrors.name;
      }
    }

    setErrors(newErrors);
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (Object.keys(errors).length > 0) {
    alert("Please fix errors before submitting");
    return;
  }

  if (
    formData.name.length < 3 ||
    !emailRegex.test(formData.email) ||
    formData.phone.length !== 13
  ) {
    alert("Please enter valid details");
    return;
  }

  try {
    const response = await fetch(
      "https://sms-web-solutions.onrender.com/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          projectDetails: formData.message
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful!");

      setFormData({
        name: "",
        email: "",
        phone: "+91",
        message: ""
      });

      setErrors({});
    } else {
      alert(data.message || "Registration failed");
    }

  } catch (error) {
    alert("Server error. Please try again.");
  }
};


  return (
    <section className="contact" id="contact">

      <div className="contact-box">

        <h2>Ready to Build Your Website?</h2>

        <p>
          Let’s create a professional website for your business.
        </p>

        <form className="register-form" onSubmit={handleSubmit}>

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          {errors.name && (
            <span className="error">{errors.name}</span>
          )}

          {/* Email */}
          <input
            type="text"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && (
            <span className="error">{errors.email}</span>
          )}

          {/* Phone */}
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          {errors.phone && (
            <span className="error">{errors.phone}</span>
          )}

          {/* Message */}
          <textarea
            name="message"
            placeholder="Tell us about your project"
            value={formData.message}
            onChange={handleChange}
          />

          <button type="submit" className="btn register-btn">
            Register Now
          </button>

        </form>

      </div>

    </section>
  );
};

export default Contact;
