import { createContext, useContext, useState } from 'react';
import { clearCart, addToCart } from '../data/Api';

const RentalBagContext = createContext(null);

const PRICE_FIELD = {
  7: 'rentalPrice7Days',
  14: 'rentalPrice14Days',
  30: 'rentalPrice30Days',
};

export function RentalBagProvider({ children }) {
  const [bag, setBag] = useState([]); // [{ book, duration }]
  const [wishlist, setWishlist] = useState([]);

  const addToBag = (book, duration = 7) => {
    setBag((prev) => {
      const exists = prev.find((i) => i.book._id === book._id);
      if (exists) {
        return prev.map((i) =>
          i.book._id === book._id ? { ...i, duration } : i
        );
      }
      return [...prev, { book, duration }];
    });
  };

  const updateDuration = (bookId, duration) => {
    setBag((prev) =>
      prev.map((i) => (i.book._id === bookId ? { ...i, duration } : i))
    );
  };

  const removeFromBag = (bookId) =>
    setBag((prev) => prev.filter((i) => i.book._id !== bookId));

  const clearBag = () => setBag([]);

  const toggleWishlist = (book) => {
    setWishlist((prev) =>
      prev.find((b) => b._id === book._id)
        ? prev.filter((b) => b._id !== book._id)
        : [...prev, book]
    );
  };

  const isWishlisted = (bookId) => wishlist.some((b) => b._id === bookId);

  // Price for a given duration — falls back to 7-day price if field missing
  const getPriceForDuration = (book, duration) => {
    const field = PRICE_FIELD[duration] || PRICE_FIELD[7];
    return book[field] ?? book.rentalPrice7Days ?? 0;
  };

  // NOTE: This is a LOCAL ESTIMATE only, shown in the bag/checkout preview.
  // The real, authoritative total always comes from the backend
  // (POST /api/cart/checkout response), never from this function.
  const getBagSummary = () => {
    const rentalFee = bag.reduce(
      (sum, i) => sum + getPriceForDuration(i.book, i.duration),
      0
    );
    const securityDeposit = bag.reduce(
      (sum, i) => sum + (i.book.securityDeposit || 0),
      0
    );
    const deliveryFee = bag.length > 0 ? 40 : 0;
    const discount = 0; // rewards/discount logic comes later, from backend
    const total = rentalFee + securityDeposit + deliveryFee - discount;
    const earnedPoints = Math.round(rentalFee / 10);

    return { rentalFee, securityDeposit, deliveryFee, discount, total, earnedPoints };
  };

  // Pushes the local bag into the backend cart before checkout, so
  // POST /api/cart/checkout (which reads the SERVER cart) has the
  // correct items/durations. Backend cart is cleared first to avoid
  // stale/duplicate items from a previous session.
  const syncBagToBackendCart = async () => {
    await clearCart();
    for (const item of bag) {
      await addToCart(item.book._id, item.duration, 1);
    }
  };

  // Stub for now — real reward crediting happens on the backend
  // (/api/rewards) in a later phase. Kept here so existing calls
  // don't break, but it intentionally does nothing yet.
  const addRewardPoints = () => {};

  return (
    <RentalBagContext.Provider
      value={{
        bag,
        addToBag,
        removeFromBag,
        updateDuration,
        clearBag,
        wishlist,
        toggleWishlist,
        isWishlisted,
        getPriceForDuration,
        getBagSummary,
        syncBagToBackendCart,
        addRewardPoints,
      }}
    >
      {children}
    </RentalBagContext.Provider>
  );
}

export const useRentalBag = () => useContext(RentalBagContext);