"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { addReview, updateReview } from "@/utils/actions/mutations";

interface Props {
  productId: number;
  existingReview?: {
    id: number;
    rating: number;
    title: string | null;
    comment: string;
  };
  closeEditMode?: () => void;
}

const ReviewForm = ({ productId, closeEditMode, existingReview }: Props) => {
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (existingReview) {
        await updateReview(
          existingReview.id,
          rating,
          title,
          comment,
          productId
        );
        toast.success("Review Updated");
        if (closeEditMode) closeEditMode();
      } else {
        await addReview(productId, rating, title, comment);
        toast.success("Review Created");
        setComment("");
        setTitle("");
        setRating(5);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong at Review mutation"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-muted/30 p-6 rounded-xl border border-border"
    >
      {/* rating selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Title Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          placeholder="Summarize your experience (e.g., 'Great value for money')"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Comment Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Review</label>
        <Textarea
          placeholder="Share details about your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Submitting..."
            : existingReview
            ? "Update Review"
            : "Post Review"}
        </Button>
        {existingReview && (
          <Button type="button" variant="ghost" onClick={closeEditMode}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
