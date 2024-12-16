/*
UUsing JavaScript in your browser only, you will listen for the form's submit event; when the form is submitted, you will:

*/

// import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    const isValidFirstName = (firstName) => {
        return firstName && typeof firstName === 'string' && firstName.length >= 2 && firstName.length <= 25 && !/\d/.test(firstName);
    };

    const isValidLastName = (lastName) => {
        return lastName && typeof lastName === 'string' && lastName.length >= 2 && lastName.length <= 25 && !/\d/.test(lastName);
    };

    const isValidUserId = (userId) => {
        return userId && typeof userId === 'string' && userId.length >= 5 && userId.length <= 10;
    };

    const isValidPassword = (password) => {
        return (
            password &&
            typeof password === 'string' &&
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(password)
        );
    };

    const displayErrors = (errors, errorContainer) => {
        const serverError = document.querySelector('.error-message');
        if (serverError) serverError.remove();
        if (errors.length > 0) {
            errorContainer.innerHTML = errors.map((err) => `<p>${err}</p>`).join('');
        } else {
            errorContainer.innerHTML = '';
        }
    };

    const searchForm = document.getElementById('searchTitle');
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const errors = [];

            const sear = document.getElementById('searchByTitle').value.trim();

            if (sear == "") errors.push('Title must be a non empty string!\n');
            //if (sear.localeCompare("Luigi's Mansion") != 0 ) errors.push('Bad Game!');

            const errorContainer = document.getElementById('error-container');
            displayErrors(errors, errorContainer);

            if (errors.length === 0) searchForm.submit();
        });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const errors = [];

            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const userId = document.getElementById('userId').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();

            if (!isValidFirstName(firstName)) errors.push('First name must be 2-25 characters and cannot contain numbers!\n');
            if (!isValidLastName(lastName)) errors.push('Last name must be 2-25 characters and cannot contain numbers!\n');
            if (!isValidUserId(userId)) errors.push('User ID must be 5-10 characters long!\n');
            if (!isValidPassword(password)) errors.push('Password must be at least 8 characters, including an uppercase letter, a number, and a special character!\n');
            if (password !== confirmPassword) errors.push('Passwords do not match!\n');

            const errorContainer = document.getElementById('error-container');
            displayErrors(errors, errorContainer);

            if (errors.length === 0) signupForm.submit();
        });
    }

    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const errors = [];
            let bool = false;

            const userId = document.getElementById('userId').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!isValidUserId(userId)){
                errors.push('Error: either the userId or password is invalid.\n');
                bool = true;
            } 
            if ((!isValidPassword(password)) && bool === false) errors.push('Error: either the userId or password is invalid.\n');

            const errorContainer = document.getElementById('error-container');
            displayErrors(errors, errorContainer);

            if (errors.length === 0) signinForm.submit();
        });
    }

    let favoriteButton = document.getElementById('favorite-button');
    if (favoriteButton) {
        favoriteButton.addEventListener('click', async () => {
            console.log('Favorite button clicked'); // Debug: Check if event fires
            const gameId = favoriteButton.dataset.gameId; // Get game ID
            const isFavorited = favoriteButton.classList.contains('favorited'); // Get current state
            console.log({ gameId, isFavorited }); // Debug: Log game ID and state

            try {
                const response = await axios.post('/favorite', { gameId, isFavorited }); // Make POST request
                console.log('Server response:', response.data); // Debug: Log server response
                if (response.data.success) {
                    // Toggle button state
                    favoriteButton.classList.toggle('favorited', !isFavorited);
                    favoriteButton.classList.toggle('not-favorited', isFavorited);
                    favoriteButton.textContent = !isFavorited ? 'Unfavorite' : 'Favorite';
                }
            } catch (error) {
                console.error('Error toggling favorite:', error); // Debug: Log any errors
            }
        });
    } else {
        console.error('Favorite button not found'); // Debug: If button is missing
    }
    let addUser = document.getElementById('addFollowing');
    if(addUser){
        addUser.addEventListener('submit', (event) => {
            event.preventDefault();
            const errors = [];

            const userId = document.getElementById('friendUserId').value.trim();

            if (!isValidUserId(userId)){
                errors.push('Invalid User ID provided\n');
                bool = true;
            } 
            const errorContainer = document.getElementById('error-container');
            displayErrors(errors, errorContainer);

            if (errors.length === 0) addUser.submit();
        });
    }
    let review = document.getElementById('myForm');
    if(review){
        review.addEventListener('submit', (event) => {
            event.preventDefault();
            const errors = [];

            const rev = document.getElementById('review').value.trim();
            if (!rev) errors.push('Cannot have empty review \n');
            if (typeof rev !== "string") errors.push('Invalid Review provided\n');

            const errorContainer = document.getElementById('error-container');
            displayErrors(errors, errorContainer);

            if (errors.length === 0) review.submit();
        });
    }

    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            console.log('Like button clicked'); 
            const gameId = button.dataset.gameId; 
            const reviewId = button.dataset.userId; 
            const isLiked = button.classList.contains('liked'); 

            console.log({ gameId, reviewId, isLiked });

            try {
                button.classList.toggle('liked', !isLiked);
                button.classList.toggle('not-liked', isLiked);
                const response = await axios.post('/like', { gameId, reviewId, isLiked });
            } catch (error) {
                console.error('Error toggling like:', error); 
            }
        });
});
const dislikeButtons = document.querySelectorAll('.dislike-button');
dislikeButtons.forEach((button) => {
    button.addEventListener('click', async () => {
        console.log('Like button clicked'); 
        const gameId = button.dataset.gameId; 
        const reviewId = button.dataset.userId; 
        const isDisliked = button.classList.contains('disliked'); 

        console.log({ gameId, reviewId, isDisliked });

        try {
            button.classList.toggle('disliked', !isDisliked);
            button.classList.toggle('not-disliked', isDisliked);
            const response = await axios.post('/dislike', { gameId, reviewId, isDisliked });
        } catch (error) {
            console.error('Error toggling like:', error); 
        }
    });
});
})