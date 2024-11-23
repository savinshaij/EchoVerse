"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    profession: "",
    bio: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Logged In:", formData);

    // Store session data locally
    localStorage.setItem(
      "session",
      JSON.stringify({
        email: formData.email,
        name: formData.name,
        profession: formData.profession,
        bio: formData.bio,
      })
    );

    // Redirect to the root page
    router.push("/");
  };

  return (
    <div className="h-screen flex">
      {/* Left Section (50%) */}
      <div className="w-1/2 bg-[#181918] hidden md:flex flex-col justify-center  text-white p-6">
        <h1 className="text-8xl px-7 font-bold mb-4">Welcome to EchoVerse</h1>
        <p className="text-lg px-8">
          EchoVerse is the ultimate platform to connect share and inspire. Join
          our growing community where ideas and creativity thrive.Make
          connections that matter.
        </p>
      </div>

      {/* Right Section (50%) */}
      <div className="md:w-1/2 w-full px-3 md:px-0   bg-[#dee9e1] flex items-center justify-center bg-gra">
        <div className="w-full max-w-md bg-[#dee9e1] border-4 border-black p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Create an Account
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full mt-1 p-2 text bg-[#dee9e1] border-2 border-black rounded-lg focus:ring"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full mt-1 p-2 text bg-[#dee9e1] border-2 border-black rounded-lg focus:ring"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full mt-1 p-2 text bg-[#dee9e1] border-2 border-black rounded-lg focus:ring"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="profession" className="block text-sm font-medium">
                Profession
              </label>
              <input
                type="text"
                id="profession"
                className="w-full mt-1 p-2 text bg-[#dee9e1] border-2 border-black rounded-lg focus:ring"
                placeholder="Enter your profession"
                value={formData.profession}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                className="w-full mt-1 p-2 text bg-[#dee9e1] border-2 border-black rounded-lg focus:ring"
                placeholder="Tell us about yourself"
                rows="3"
                value={formData.bio}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#181918] border-2 border-black hover:text-black text-white py-2 rounded-md hover:bg-white transition"
            >
              Let&lsquo;s Go
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
