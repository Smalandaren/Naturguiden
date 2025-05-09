"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SuggestPlacePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    address: "",
    categoryNames: "",
    attributeNames: "",
    imageUrls: "",
    userName: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      categoryNames: formData.categoryNames
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
      attributeNames: formData.attributeNames
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
      imageUrls: formData.imageUrls
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
    };

    try {
      const res = await fetch("https://localhost:7055/api/PlaceSuggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Förslag inskickat!");
        router.push("/");
      } else {
        const text = await res.text();
        console.error("Fel från API:", text);
        alert("Något gick fel: " + res.status);
      }
    } catch (error) {
      console.error("Nätverksfel:", error);
      alert("Kunde inte kontakta servern.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Föreslå en ny plats</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Namn på plats" required onChange={handleChange} className="w-full p-2 border" />
        <textarea name="description" placeholder="Beskrivning" required onChange={handleChange} className="w-full p-2 border" />
        <input name="latitude" placeholder="Latitud" required onChange={handleChange} className="w-full p-2 border" />
        <input name="longitude" placeholder="Longitud" required onChange={handleChange} className="w-full p-2 border" />
        <input name="address" placeholder="Adress" onChange={handleChange} className="w-full p-2 border" />
        <input name="categoryNames" placeholder="Kategorinamn (t.ex. Skog,Strand)" onChange={handleChange} className="w-full p-2 border" />
        <input name="attributeNames" placeholder="Attributnamn (t.ex. Grillplats,Toalett)" onChange={handleChange} className="w-full p-2 border" />
        <input name="imageUrls" placeholder="Bild-URL:er (kommaseparerade)" onChange={handleChange} className="w-full p-2 border" />
        <input name="userName" placeholder="Ditt förnamn" required onChange={handleChange} className="w-full p-2 border" />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Tillbaka
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Skicka
          </button>
        </div>
      </form>
    </div>
  );
}
