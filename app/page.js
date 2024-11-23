"use client";

import nlp from "compromise";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [posts, setPosts] = useState([]); // State to store posts
  const [fileSelected, setFileSelected] = useState(false); // State to manage file selection
  const [fileName, setFileName] = useState(""); // To store the name of the selected file
  const [error, setError] = useState("");
  const [video, setVideo] = useState(null);
  const [productData, setProductData] = useState(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [pro, setPro] = useState("");
  const [session, setSession] = useState(null);

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem("session"));
    if (!sessionData) {
      router.push("/getIn");
    } else {
      setSession(sessionData);
      setUserName(sessionData.name);
      setEmail(sessionData.email);
      setBio(sessionData.bio);
      setPro(sessionData.profession);
    }
  }, [router]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const newPost = {
      title: form.postTitle.value,
      caption: form.postCaption.value,
      tag: form.postTag.value,
      file: form.postFile.files[0] || null,
      productData: null,
    };

    if (!newPost.file) {
      setError("Please select a file.");
      return;
    }

    const file = newPost.file;
    const fileType = file.type.split("/")[0];

    if (fileType !== "video" && fileType !== "audio") {
      setError("Invalid file type! Only video and audio files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10 MB!");
      return;
    }

    setError(""); // Clear any previous errors
    setVideo(URL.createObjectURL(file)); // Set video for playback

    const formData = new FormData();
    formData.append("file", file);
    setPosts([newPost, ...posts]);
    try {
      // Extract audio from the uploaded video
      const response = await fetch("/api/extractAudio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to extract audio: ${response.status}`);
      }

      const { audioPath } = await response.json();

      // Now send the audio file for transcription
      const transcriptionFormData = new FormData();
      transcriptionFormData.append("file", file);

      const transcriptionResponse = await fetch("/api/transcribe", {
        method: "POST",
        body: transcriptionFormData,
      });

      if (!transcriptionResponse.ok) {
        throw new Error(`Failed to transcribe audio: ${transcriptionResponse.status}`);
      }

      const { transcription } = await transcriptionResponse.json();
      const productss = extractProductsFromParagraph(transcription);

      // if (!productss || productss.length === 0) {
      //   setError("No product detected from transcription.");
      //   return;
      // }
      console.log(productss[0]);
      // Now use the transcription data to detect a product
      const productResponse = await fetch("/api/detectProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productss[0]),
      });

      if (!productResponse.ok) {
        throw new Error(`Failed to detect product: ${productResponse.status}`);
      }

      newPost.productData = await productResponse.json();
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error("Error during file processing:", error);
      setError("An error occurred while processing the video.");
    }

    form.reset();
    setFileSelected(false);
    setFileName("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileSelected(true);
      setFileName(selectedFile.name);
    } else {
      setFileSelected(false);
      setFileName("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("session");
    router.push("/getIn");
  };

  if (!session) {
    return (
      <p className="text-gray-600">No session found. Redirecting to login...</p>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row ">
        {/* Left Section */}
        <div className="w-full h-screen  md:w-1/3 bg-[#c6ecd0] border border-stone-950  flex flex-col items-center p-6 pt-10 space-y-6 ">
        <div className="w-full flex justify-end items-center md:hidden">
        <button
              onClick={handleLogout}
              className="font-bold border-2 border-black hover:text-white text-black py-2 px-4 rounded-md hover:bg-[#181918] transition"
            >
              LogOut
            </button>
        </div>
       
          {/* Enhanced Profile Card */}
          <div className="bg-white border-2 border-[#181918] w-full max-w-sm rounded-xl shadow-lg p-6 text-gray-800">
            <div className="flex items-center space-x-4">
              <img
                src="/profile.jpg"
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-gray-100 shadow-md"
              />
              <div>
                <h2 className="text-2xl font-bold">{userName}</h2>
                <p className="text-sm text-gray-600">{pro}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm">
                <strong>Email:</strong> {email}
              </p>
              <p className="mt-1 text-sm">
                <strong>Bio:</strong> {bio}
              </p>
            </div>
          </div>
  
          {/* Add Post Card */}
          <div className="bg-white border-2 shadow-lg border-black w-full max-w-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#181918] mb-4">Add Post</h2>
            <form className="space-y-4" onSubmit={handlePostSubmit}>
              {/* Title */}
              <div>
                <label
                  htmlFor="postTitle"
                  className="block text-sm font-medium text-white"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="postTitle"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring"
                  placeholder="Enter title"
                  required
                />
              </div>
              {/* Caption */}
              <div>
                <label
                  htmlFor="postCaption"
                  className="block text-sm font-medium text-gray-700"
                >
                  Caption
                </label>
                <textarea
                  id="postCaption"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring"
                  rows="3"
                  placeholder="Write your caption..."
                  required
                ></textarea>
              </div>
              {/* Tag */}
              <div>
                <label
                  htmlFor="postTag"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tag
                </label>
                <input
                  type="text"
                  id="postTag"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring"
                  placeholder="Add a tag (e.g., #coding)"
                  required
                />
              </div>
              {/* File Input */}
              <div>
                <label
                  htmlFor="postFile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Attach Video
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="postFile"
                    className={`w-full h-10 text-sm text-gray-600 cursor-pointer border-2 border-gray-300 rounded-md opacity-0 absolute top-0 left-0 ${
                      fileSelected ? "bg-green-100" : ""
                    }`}
                    accept="video/*"
                    required
                    onChange={handleFileChange}
                  />
                  <div
                    className={`flex justify-between items-center bg-gray-100 border border-gray-300 rounded-md h-10 px-3`}
                  >
                    <span className="text-gray-600">
                      {fileSelected ? "File Selected" : "Choose a file"}
                    </span>
                    <button
                      type="button"
                      className="text-white text-xs px-3 py-1 rounded-md bg-[#181918] border-2 border-black hover:text-black transition"
                      disabled={fileSelected}
                    >
                      Browse
                    </button>
                  </div>
                </div>
              </div>
              {/* Post Button */}
              <button
                type="submit"
                className="w-full bg-[#181918] border-2 border-black hover:text-black text-white py-2 rounded-xl hover:bg-white transition"
              >
                Post
              </button>
            </form>
          </div>
        </div>
  
        {/* Right Section */}
        <div className="w-full md:w-2/3 bg-[#dee9e1] flex flex-col justify-start items-center p-6 overflow-y-auto">
          <div className="w-full px-7 mb-6 flex justify-between items-center">
            <div  className=" md:flex hidden"/>
            <h1 className="text-3xl font-bold text-gray-800 ">Posts</h1>
            <div className="md:flex hidden">
            <button
              onClick={handleLogout}
              className="font-bold border-2  border-black hover:text-white text-black py-2 px-4 rounded-md hover:bg-[#181918] transition"
            >
              LogOut
            </button>
            </div>
           
          </div>
  
          <div className="w-full flex flex-col justify-center items-center space-y-6">
            {/* Display the posts dynamically */}
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-[#181918] p-6 w-full max-w-sm rounded-lg shadow-md"
                >
                  {/* Video Player */}
                  <div className="relative">
                    <video
                      src={URL.createObjectURL(post.file)}
                      controls
                      className="w-full h-auto rounded-lg max-w-[100%] max-h-[500px] object-cover"
                    ></video>
                  </div>
                  <h3 className="text-xl font-semibold mt-4">{post.title}</h3>
                  <p className="text-sm text-gray-700">{post.caption}</p>
                  <p className="text-xs text-gray-500">{post.tag}</p>
                  <div className="bg-gray-200 w-full flex justify-center items-center rounded-lg border-2 border-black mt-3">
                    {post.productData ? (
                      <div className="p-6 gap-4 flex rounded-lg shadow-md">
                        <img
                          src={post.productData.thumbnail}
                          alt={post.productData.title}
                          className="w-24 mb-4"
                        />
                        <div>
                          <h3 className="text-base font-semibold">
                            {post.productData.title}
                          </h3>
                          <p className="text-gray-700">
                          ₹ {post.productData.price}
                          </p>
                          <a
                            href={post.productData.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View on Amazon
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 px-4 mt-4">
                        Loading product details...
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <>
                <img
                  src="/image1.png"
                  alt="post not found"
                  className="h-96 py-10"
                />
                <p className="text-gray-600 w-full text-xl text-center">
                  No posts yet. Add a post
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
}




const extractProductsFromParagraph = (paragraph) => {
  if (!paragraph.trim()) {
    return [];
  }

  // Preprocess the paragraph: remove all occurrences of "The" or "the" from anywhere in the paragraph
  let normalizedParagraph = paragraph.trim();

  // Remove all instances of "The" or "the" from the entire string
  normalizedParagraph = normalizedParagraph.replace(/\b(the|The)\b/g, '');

  // Use Compromise to parse the input paragraph
  const doc = nlp(normalizedParagraph);

  // Extract nouns from the paragraph
  const nouns = doc.nouns().out('array');

  // Define stop words (common words that aren't likely to be product names)
  const stopWords = [
    "with", "and", "in", "on", "for", "at", "by", "a", "an", "of", "as", "that", "this", "to", "from", "is", "are", "was", "it", "we", "they", "don't", "has", "have", "i", "you", "he", "she", "they", "there"
  ];

  // Filter out stop words from the noun list by converting them to lowercase
  const filteredNouns = nouns.filter(word => !stopWords.includes(word.toLowerCase()));

  // Combine consecutive capitalized nouns or numbers into multi-word product names
  let result = [];
  for (let i = 0; i < filteredNouns.length; i++) {
    // Check if the current word contains at least one capital letter
    if (/[A-Z]/.test(filteredNouns[i])) {
      // Check if the next word also contains a capital letter, indicating a multi-word product name
      if (i + 1 < filteredNouns.length && /[A-Z]/.test(filteredNouns[i + 1])) {
        result.push(`${filteredNouns[i]} ${filteredNouns[i + 1]}`);
        i++; // Skip the next word as it's already combined
      } else {
        result.push(filteredNouns[i]);
      }
    }
  }

  // Remove duplicates and finalize the product list
  const uniqueProducts = [...new Set(result)];

  // Remove punctuation (commas, periods, etc.) from the end of each product name
  const cleanedProducts = uniqueProducts.map(product => product.replace(/[.,!?;]$/, ''));
  console.log(cleanedProducts)
  // Return the cleaned product names as an array
  return cleanedProducts;
};