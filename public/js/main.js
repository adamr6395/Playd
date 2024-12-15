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

            const userId = document.getElementById('userId').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!isValidUserId(userId)) errors.push('User ID must be 5-10 characters long!\n');
            if (!password || password.length < 8) errors.push('Password must be at least 8 characters long!\n');

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

});
