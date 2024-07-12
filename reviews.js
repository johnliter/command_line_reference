document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.getElementById('reviews');
    const reviewsUrl = 'https://johnliter.github.io/command_line_reference/reviews.json';

    async function fetchReviews() {
        const response = await fetch(reviewsUrl);
        const reviews = await response.json();
        renderReviews(reviews);
    }

    function renderReviews(reviewsToRender) {
        reviewsContainer.innerHTML = '';
        reviewsToRender.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'bg-white dark:bg-gray-700 p-4 rounded shadow-md mb-4';
            reviewCard.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <span class="text-lg font-bold">${review.name}</span>
                    <span>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                </div>
                <p>${review.comments}</p>
            `;
            reviewsContainer.appendChild(reviewCard);
        });
    }

    fetchReviews();
});
