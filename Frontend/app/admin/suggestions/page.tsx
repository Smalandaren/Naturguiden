"use client";

import { useEffect, useState } from "react";

type Suggestion = {
  id: number;
  name: string;
  description: string;
  isConfirmed: boolean;
  isPublished: boolean;
};

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const fetchSuggestions = async () => {
    const res = await fetch("https://localhost:7055/api/PlaceSuggestion");
    const data = await res.json();
  
    console.log("📦 API-response (alla förslag):", data);
  
    const unhandled = data.filter((s: Suggestion) => !s.isPublished);
    setSuggestions(unhandled);
  
    setSuggestions(data); 
  };

  const confirmSuggestion = async (id: number) => {
    await fetch(`https://localhost:7055/api/PlaceSuggestion/${id}/confirm`, {
      method: "PUT",
    });
    fetchSuggestions();
  };

  const publishSuggestion = async (id: number) => {
    await fetch(`https://localhost:7055/api/PlaceSuggestion/${id}/publish`, {
      method: "POST",
    });
  
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };
  

  const rejectSuggestion = async (id: number) => {
    const confirm = window.confirm("Är du säker på att du vill neka detta förslag?");
    if (!confirm) return;

    await fetch(`https://localhost:7055/api/PlaceSuggestion/${id}`, {
      method: "DELETE",
    });
    fetchSuggestions();
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Platsförslag</h1>
      {suggestions.map((s) => (
        <div key={s.id} className="border p-4 mb-4 rounded">
          <h2 className="text-xl font-semibold">{s.name}</h2>
          <p>{s.description}</p>
          <p>Status: {s.isConfirmed ? " Bekräftad" : " Ej bekräftad"}</p>
          <div className="flex gap-2 mt-2">
            {!s.isConfirmed && (
              <button
                onClick={() => confirmSuggestion(s.id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Bekräfta
              </button>
            )}
            {s.isConfirmed && (
              <button
                onClick={() => publishSuggestion(s.id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Publicera
              </button>
            )}
            <button
              onClick={() => rejectSuggestion(s.id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Neka
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
