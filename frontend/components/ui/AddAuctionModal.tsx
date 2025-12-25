"use client";

import { useEffect, useState } from "react";
import { Auction } from "@/types/auction";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface AddAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAuction: (auction: Auction) => void;
}

const AddAuctionModal = ({
  isOpen,
  onClose,
  onAddAuction,
}: AddAuctionModalProps) => {
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const [title, setTitle] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [year, setYear] = useState("");
  const [currentBid, setCurrentBid] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      return () => document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle("");
    setCategoryID("");
    setYear("");
    setCurrentBid("");
    setTimeLeft("");
    setImage("");
    setError("");
  };

  const handleSubmit = () => {
    if (!title || !categoryID || !currentBid || !timeLeft) {
      setError("Please fill in all required fields.");
      return;
    }

    const newAuction: Auction = {
      id: Date.now(),
      title,
      categoryID,
      year,
      currentBid,
      timeLeft,
      image: image || "/images/auctions/rolex.png",
      bidsCount: 0,
    };

    onAddAuction(newAuction);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/80" onClick={onClose} />

      <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 shadow-2xl p-8">
        <h2 className="text-2xl font-semibold mb-6">Add New Auction</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          <select
            value={categoryID}
            onChange={(e) => setCategoryID(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select category *</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          <input
            type="text"
            placeholder="Current Bid * (e.g. $500)"
            value={currentBid}
            onChange={(e) => setCurrentBid(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          <input
            type="text"
            placeholder="Time Left * (e.g. 2d 5h)"
            value={timeLeft}
            onChange={(e) => setTimeLeft(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          <input
            type="text"
            placeholder="Image URL (optional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-md">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add Auction
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAuctionModal;
