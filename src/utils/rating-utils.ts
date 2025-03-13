/**
 * Count ratings by star level (1-5)
 * @param reviews List of reviews
 * @returns Object containing count for each star level
 */
export function countRatingsByLevel(reviews: DatLich.Review[]): { [key: number]: number } {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  reviews.forEach(review => {
    const rating = Math.floor(review.rating);
    if (rating >= 1 && rating <= 5) {
      counts[rating as keyof typeof counts] += 1;
    }
  });
  
  return counts;
}

/**
 * Calculate average rating from reviews
 * @param reviews List of reviews
 * @returns Average rating (0-5)
 */
export function calculateAverageRating(reviews: DatLich.Review[]): number {
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}

/**
 * Get percentage for a specific rating level
 * @param count Number of ratings at this level
 * @param total Total number of ratings
 * @returns Percentage (0-100)
 */
export function getRatingPercentage(count: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}
