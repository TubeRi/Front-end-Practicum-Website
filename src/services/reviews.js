export function formatReviewDate(createdAt) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Vilnius',
  }).format(new Date(createdAt));
}

export function createReview({ name, rating, review }, user, now = new Date()) {
  if (!user?.id) throw new Error('Please log in before leaving a review.');
  const cleanName = name.trim();
  const quote = review.trim();
  const score = Number(rating);
  if (!cleanName || cleanName.length > 80) throw new Error('Enter a name of up to 80 characters.');
  if (!Number.isInteger(score) || score < 1 || score > 5) throw new Error('Choose a rating from 1 to 5.');
  if (quote.length < 20 || quote.length > 1500) throw new Error('Write a review between 20 and 1,500 characters.');
  return {
    id: crypto.randomUUID(),
    name: cleanName,
    initials: cleanName.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase(),
    rating: score.toFixed(1),
    quote,
    createdAt: now.toISOString(),
  };
}
