import { getEligibleOrder, getProductReview } from "@/utils/actions/mutations";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { Button } from "@/components/ui/button";
import StarRating from "./StarRating";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const ReviewsSection = async ({
  productId,
  isAuthenticated,
  userId,
}: {
  productId: number;
  isAuthenticated: boolean;
  userId?: string;
}) => {
  const reviews = await getProductReview(productId);

  let canReview = false;
  if (isAuthenticated && userId) {
    const order = await getEligibleOrder(userId, productId);
    // User can review if they have an order AND haven't reviewed yet
    const hasReviewed = reviews.some((r) => r.userId === userId);
    canReview = !!order && !hasReviewed;
  }

  // Stats Logic
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : 0;

  return (
    <section
      className="py-24 border-t border-border bg-background"
      id="reviews"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Summary Column */}
          <div className="w-full md:w-1/3 space-y-6">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold">
                {averageRating.toFixed(1)}
              </span>
              <div className="space-y-1">
                <StarRating rating={Math.round(averageRating)} size="lg" />
                <p className="text-sm text-muted-foreground">
                  {totalReviews} Reviews
                </p>
              </div>
            </div>

            {/* CONDITIONAL UI MESSAGING */}
            {!isAuthenticated ? (
              <div className="p-4 bg-muted/50 rounded-lg text-center space-y-3">
                <p className="text-sm font-medium">Log in to write a review</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/login?callbackUrl=/products/${productId}`}>
                    Log In
                  </Link>
                </Button>
              </div>
            ) : canReview ? (
              // This case is handled in the Right Column (Form appears)
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                <p className="text-sm text-green-700 font-medium">
                  You purchased this item. <br /> Share your thoughts!
                </p>
              </div>
            ) : reviews.some((r) => r.userId === userId) ? (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
                <p className="text-sm text-primary font-medium">
                  Thanks for your review!
                </p>
              </div>
            ) : (
              // User logged in BUT hasn't bought it
              <div className="p-4 bg-muted/30 border border-border rounded-lg text-center space-y-2">
                <ShoppingBag className="w-6 h-6 mx-auto text-muted-foreground" />
                <p className="text-sm font-medium">Verified Purchase Only</p>
                <p className="text-xs text-muted-foreground">
                  You must purchase this item to leave a review.
                </p>
              </div>
            )}
          </div>

          {/* Reviews Column */}
          <div className="w-full md:w-2/3">
            {/* Only show form if 'canReview' is true */}
            {canReview && (
              <div className="mb-10 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                <ReviewForm productId={productId} />
              </div>
            )}

            {reviews.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
                <ReviewList
                  reviews={reviews}
                  currentUserId={userId}
                  productId={productId}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
