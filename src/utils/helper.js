/**
 * Formats a date string into a readable format
 * @param {string} dateString - ISO date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };

  return new Date(dateString).toLocaleDateString(undefined, defaultOptions);
};

/**
 * Calculates time remaining until a date
 * @param {string} endDate - ISO date string
 * @returns {string} Time remaining string (e.g., "2 days left")
 */
export const getTimeRemaining = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} left`;
  }
  return `${hours} hour${hours !== 1 ? 's' : ''} left`;
};