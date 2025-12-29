"use client";

import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReviewForm from "./ReviewForm";
import { CheckCircle2, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteReview } from "@/utils/actions/mutations";
import StarRating from "./StarRating";

interface Review {
  id: number;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: Date | null;
  userId: string | null;
  userName: string;
  isVerifiedPurchase: boolean | null;
  userImage: string | null;
}

export default function ReviewList({
  reviews,
  currentUserId,
  productId,
}: {
  reviews: Review[];
  currentUserId?: string;
  productId: number;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleDelete = async (reviewId: number) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview(reviewId, productId);
      toast.success("Review deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-8 mt-8">
      {reviews.length === 0 && (
        <p className="text-muted-foreground text-center py-10">
          No reviews yet. Be the first!
        </p>
      )}

      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-b border-border pb-8 last:border-0"
        >
          {editingId === review.id ? (
            <ReviewForm
              productId={productId}
              existingReview={{
                id: review.id,
                rating: review.rating,
                title: review.title,
                comment: review.comment,
              }}
              closeEditMode={() => setEditingId(null)}
            />
          ) : (
            <div className="flex gap-4">
              <Avatar className="w-10 h-10 border border-border">
                <AvatarImage src={review.userImage || ""} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {review.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">
                        {review.userName}
                      </h4>
                      {review.isVerifiedPurchase && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1 py-0 h-5 gap-1 text-green-600 bg-green-500/10 hover:bg-green-500/20 border-green-500/20"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} size="sm" />
                      {review.title && (
                        <span className="font-medium text-sm text-foreground/90">
                          {review.title}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions for Review Owner */}
                  {currentUserId && review.userId === currentUserId && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => setEditingId(review.id)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive/80 hover:text-destructive"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed">
                  {review.comment}
                </p>

                <p className="text-xs text-muted-foreground mt-2">
                  {review.createdAt
                    ? formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })
                    : "Just now"}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
