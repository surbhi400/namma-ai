import { useState } from "react";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const FormSection = ({ setLocation }) => {
  const [type, setType] = useState("image");
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !desc || !address) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      // Geocode address
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const geoData = await geoRes.json();
      const location = geoData?.results?.[0]?.geometry?.location;
      console.log("Geocode response:", geoData);
      if (!location) {
        alert("Invalid address");
        setLoading(false);
        return;
      }

      const { lat, lng } = location;
      setLocation({ lat, lng }); // Update map

      // Upload file
      const path = `${type}s/${uuidv4()}_${file.name}`;
      const fileRef = ref(storage, path);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      // Save to Firestore
      await addDoc(collection(db, "submissions"), {
        type,
        category,
        mediaUrl: url,
        desc,
        address,
        lat,
        lng,
        timestamp: new Date(),
      });

      alert("Uploaded successfully");

      // Optional map refresh
      if (typeof window.refreshMap === "function") window.refreshMap();

      // Reset
      setFile(null);
      setDesc("");
      setAddress("");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 p-4 w-1/2 m-auto">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-2 w-full border border-black rounded-md"
      >
        <option value="image">Image</option>
        <option value="video">Video</option>
      </select>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 w-full border border-black rounded-md"
        required
      />

      <input
        type="text"
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="border p-2 w-full border border-black rounded-md"
        required
      />

      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border p-2 w-full border border-black rounded-md"
        required
      />

      {/* <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 w-full"
        required
      >
        <option value="">Select Category</option>
        <option value="civic">Civic (Potholes, Waterlogging)</option>
        <option value="festival">Festival</option>
        <option value="emergency">Emergency</option>
      </select> */}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 border border-black rounded-md mx-auto"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default FormSection;
