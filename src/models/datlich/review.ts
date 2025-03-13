import { useState, useCallback } from 'react';

const STORAGE_KEY = 'datlich_reviews';

export default function useReviewModel() {
  const [reviews, setReviews] = useState<DatLich.Review[]>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
  });

  const saveReviews = useCallback((updatedReviews: DatLich.Review[]) => {
    setReviews(updatedReviews);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));
  }, []);

  const addReview = useCallback((reviewData: Omit<DatLich.Review, 'id' | 'createdAt'>) => {
    const newReview: DatLich.Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedReviews = [...reviews, newReview];
    saveReviews(updatedReviews);
    return newReview;
  }, [reviews, saveReviews]);

  const updateReview = useCallback((reviewId: string, updatedData: Partial<DatLich.Review>) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId ? { ...review, ...updatedData } : review
    );
    saveReviews(updatedReviews);
  }, [reviews, saveReviews]);

  const addStaffResponse = useCallback((reviewId: string, response: string) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            staffResponse: {
              response,
              respondedAt: new Date().toISOString()
            } 
          } 
        : review
    );
    saveReviews(updatedReviews);
  }, [reviews, saveReviews]);

  const deleteReview = useCallback((reviewId: string) => {
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    saveReviews(updatedReviews);
  }, [reviews, saveReviews]);

  // Get average rating for a staff member
  const getStaffAverageRating = useCallback((staffId: string) => {
    const staffReviews = reviews.filter(review => review.staffId === staffId);
    if (staffReviews.length === 0) return 0;
    
    const sum = staffReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / staffReviews.length;
  }, [reviews]);

  // Get average rating for a service
  const getServiceAverageRating = useCallback((serviceId: string) => {
    const serviceReviews = reviews.filter(review => review.serviceId === serviceId);
    if (serviceReviews.length === 0) return 0;
    
    const sum = serviceReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / serviceReviews.length;
  }, [reviews]);

  // Check if an appointment has been reviewed
  const hasBeenReviewed = useCallback((appointmentId: string) => {
    return reviews.some(review => review.appointmentId === appointmentId);
  }, [reviews]);

  // Get reviews for a specific staff member
  const getStaffReviews = useCallback((staffId: string) => {
    return reviews.filter(review => review.staffId === staffId);
  }, [reviews]);

  // Get reviews for a specific service
  const getServiceReviews = useCallback((serviceId: string) => {
    return reviews.filter(review => review.serviceId === serviceId);
  }, [reviews]);

  return {
    reviews,
    addReview,
    updateReview,
    deleteReview,
    addStaffResponse,
    getStaffAverageRating,
    getServiceAverageRating,
    hasBeenReviewed,
    getStaffReviews,
    getServiceReviews
  };
}
