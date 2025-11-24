import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import {
  randomIntBetween,
  randomItem,
} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// API Configuration
const BASE_URL = 'https://puchero.cloud.alesanchez.es';

// General error handler to log error details.
class ErrorHandler {
  // Instruct the error handler how to log errors
  constructor(logErrorDetails) {
    this.logErrorDetails = logErrorDetails;
  }

  // Logs response error details if isError is true.
  logError(isError, res, tags = {}) {
    if (!isError) return;

    // the Traceparent header is a W3C Trace Context
    const traceparentHeader = res.request.headers['Traceparent'];

    // Add any other useful information
    const errorData = Object.assign(
      {
        method: res.request.method,
        url: res.url,
        status: res.status,
        error_code: res.error_code,
        body: res.request.body,
        response_body: res.body,
        traceparent: traceparentHeader && traceparentHeader.toString(),
      },
      tags,
    );
    this.logErrorDetails(errorData);
  }
}

// Set up the error handler to log errors to the console
const errorHandler = new ErrorHandler((error) => {
  console.error(error);
});

const existingUsers = new SharedArray('existingUsers', function () {
  return [
    { email: 'steve@example.com', password: 'Password123!@#' },
    { email: 'morgan@example.com', password: 'Password123!@#' },
    { email: 'jason@example.com', password: 'Password123!@#' },
    { email: 'steph@example.com', password: 'Password123!@#' },
    { email: 'sam@example.com', password: 'Password123!@#' },
    { email: 'zs@example.com', password: 'Password123!@#' },
    { email: 'emily@example.com', password: 'Password123!@#' },
    { email: 'allen@example.com', password: 'Password123!@#' },
    { email: 'david@example.com', password: 'Password123!@#' },
    { email: 'raymond@example.com', password: 'Password123!@#' },
    { email: 'laurel@example.com', password: 'Password123!@#' },
  ];
});

// Data for creating users and restaurants
const userNames = new SharedArray('names', function () {
  return [
    'Juan García',
    'María López',
    'Carlos Rodríguez',
    'Ana Martínez',
    'Pedro Sánchez',
    'Laura González',
    'Diego Pérez',
    'Carmen Fernández',
    'Luis Ramírez',
    'Isabel Torres',
    'Miguel Ruiz',
    'Sofía Jiménez',
    'David Moreno',
    'Elena Álvarez',
    'Pablo Castro',
  ];
});

const restaurantData = new SharedArray('restaurants', function () {
  return [
    {
      name: 'La Taquería del Centro',
      neighborhood: 'Centro',
      photograph: 'taqueria-centro.jpg',
      address: 'Av. Juárez 123, Centro',
      coordinates: { lat: 19.4326, lng: -99.1332 },
      image_url: 'https://example.com/taqueria.jpg',
      cuisine_type: 'Mexican',
    },
    {
      name: 'Sushi Paradise',
      neighborhood: 'Polanco',
      photograph: 'sushi-paradise.jpg',
      address: 'Campos Elíseos 234, Polanco',
      coordinates: { lat: 19.4335, lng: -99.1927 },
      image_url: 'https://example.com/sushi.jpg',
      cuisine_type: 'Japanese',
    },
    {
      name: 'Pasta e Vino',
      neighborhood: 'Roma Norte',
      photograph: 'pasta-vino.jpg',
      address: 'Álvaro Obregón 45, Roma Norte',
      coordinates: { lat: 19.4176, lng: -99.1628 },
      image_url: 'https://example.com/pasta.jpg',
      cuisine_type: 'Italian',
    },
    {
      name: 'Burger Express',
      neighborhood: 'Condesa',
      photograph: 'burger-express.jpg',
      address: 'Michoacán 78, Condesa',
      coordinates: { lat: 19.4105, lng: -99.1721 },
      image_url: 'https://example.com/burger.jpg',
      cuisine_type: 'American',
    },
  ];
});

const reviewComments = new SharedArray('comments', function () {
  return [
    'Excellent food, highly recommended',
    'The service was exceptional',
    'Very good value for money',
    'Delicious, I will definitely return',
    'The atmosphere is very cozy',
    'The food was good but the service took too long',
    'Incredible culinary experience',
    'Did not meet my expectations',
    'Perfect for a romantic dinner',
    'Good food but a bit expensive',
  ];
});

// k6 scenarios
export const options = {
  stages: [
    { duration: '30s', target: 25 }, // Ramp up
    { duration: '1m', target: 50 }, // Normal load
    { duration: '2m', target: 120 }, // Peak load
    { duration: '1m', target: 50 }, // Ramp down
    { duration: '30s', target: 0 }, // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% of requests < 500ms, 99% < 1s
    http_req_failed: ['rate<0.05'], // Less than 5% errors
  },
};

// Admin credentials (must exist previously in the DB)
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'Password123!@#',
};

// Global variables to share between iterations
let restaurantIds = [];
let createdRestaurantIds = [];

// Helper function to generate unique email
function generateEmail() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `user${timestamp}${random}@test.com`;
}

// Helper function to generate secure password
function generateStrongPassword() {
  return `Pass${Date.now()}!@#`;
}

// Function to register a new user
function registerUser() {
  const name = randomItem(userNames);
  const email = generateEmail();
  const password = generateStrongPassword();

  const payload = JSON.stringify({
    email: email,
    password: password,
    name: name,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(`${BASE_URL}/auth/register`, payload, params);

  const success = check(res, {
    'successful registration': (r) => r.status === 201,
  });
  errorHandler.logError(!success, res);

  return { email, password, name };
}

// Function to login
function login(email, password) {
  const payload = JSON.stringify({
    email: email,
    password: password,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(`${BASE_URL}/auth/login`, payload, params);

  const success = check(res, {
    'successful login': (r) => r.status === 200,
    'token received': (r) => r.json('access_token') !== undefined,
  });
  errorHandler.logError(!success, res);

  if (success && res.status === 200) {
    const body = JSON.parse(res.body);
    return body.access_token;
  }

  return null;
}

// Function to get restaurants
function getRestaurants(token = null) {
  const params = token
    ? {
        headers: { Authorization: `Bearer ${token}` },
      }
    : {};

  const res = http.get(`${BASE_URL}/restaurants?limit=20`, params);

  const success = check(res, {
    'restaurants obtained': (r) => r.status === 200,
    'has data': (r) => r.json('data') !== undefined,
  });
  errorHandler.logError(!success, res);

  if (res.status === 200) {
    try {
      const body = JSON.parse(res.body);
      if (body.data && Array.isArray(body.data)) {
        // Filter valid IDs (must be valid numbers)
        const ids = body.data
          .map((r) => r.id)
          .filter((id) => id != null && !isNaN(id) && id > 0);
        return ids;
      }
    } catch (e) {
      console.error('Error parsing restaurants:', e);
    }
  }

  return [];
}

// Function to get a specific restaurant
function getRestaurant(restaurantId, token = null) {
  const params = token
    ? {
        headers: { Authorization: `Bearer ${token}` },
      }
    : {};

  const res = http.get(`${BASE_URL}/restaurants/${restaurantId}`, params);

  const success = check(res, {
    'restaurant obtained': (r) => r.status === 200,
  });
  errorHandler.logError(!success, res);
}

// Function to get favorites
function getFavorites(token) {
  const params = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const res = http.get(`${BASE_URL}/me/favorites`, params);

  const success = check(res, {
    'favorites obtained': (r) => r.status === 200,
  });
  errorHandler.logError(!success, res);

  if (res.status === 200) {
    try {
      const body = JSON.parse(res.body);
      if (body.data && Array.isArray(body.data)) {
        // Filter valid IDs
        const ids = body.data
          .map((r) => r.id)
          .filter((id) => id != null && !isNaN(id) && id > 0);
        return ids;
      }
    } catch (e) {
      console.error('Error parsing favorites:', e);
    }
  }

  return [];
}

// Function to add a favorite
function addFavorite(token, restaurantId) {
  if (!restaurantId || typeof restaurantId !== 'number') {
    console.error('addFavorite: restaurantId is invalid', restaurantId);
    return false;
  }

  const params = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const res = http.post(
    `${BASE_URL}/me/favorites/${restaurantId}`,
    null,
    params,
  );

  const success = check(res, {
    'favorite added': (r) => r.status === 201 || r.status === 200,
  });
  errorHandler.logError(!success, res, { restaurantId, action: 'addFavorite' });

  return success;
}

// Function to remove a favorite
function removeFavorite(token, restaurantId) {
  if (!restaurantId || typeof restaurantId !== 'number') {
    console.error('removeFavorite: restaurantId is invalid', restaurantId);
    return false;
  }

  const params = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const res = http.del(
    `${BASE_URL}/me/favorites/${restaurantId}`,
    null,
    params,
  );

  const success = check(res, {
    'favorite removed': (r) =>
      r.status === 200 || r.status === 204 || r.status === 404, // Ignore when favorite is not found
  });
  errorHandler.logError(!success, res, {
    restaurantId,
    action: 'removeFavorite',
  });

  return success;
}

// Function to create a review
function createReview(token, restaurantId) {
  if (!restaurantId) {
    console.error('createReview: restaurantId is invalid');
    return null;
  }

  const payload = JSON.stringify({
    rating: randomIntBetween(1, 5),
    comment: randomItem(reviewComments),
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const res = http.post(
    `${BASE_URL}/restaurants/${restaurantId}/reviews`,
    payload,
    params,
  );

  const success = check(res, {
    'review created': (r) => r.status === 201,
  });

  if (!success) {
    errorHandler.logError(true, res, { restaurantId });
  }

  if (res.status === 201) {
    const body = JSON.parse(res.body);
    return body.id;
  }

  return null;
}

// Function to get reviews of a restaurant
function getReviews(restaurantId) {
  const res = http.get(`${BASE_URL}/restaurants/${restaurantId}/reviews`);

  const success = check(res, {
    'reviews obtained': (r) => r.status === 200,
  });
  errorHandler.logError(!success, res);
}

// Function to create a restaurant (admin only)
function createRestaurant(token) {
  const restaurant = randomItem(restaurantData);
  const timestamp = Date.now();

  const payload = JSON.stringify({
    ...restaurant,
    name: `${restaurant.name} ${timestamp}`,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const res = http.post(`${BASE_URL}/restaurants`, payload, params);

  const success = check(res, {
    'restaurant created by admin': (r) => r.status === 201,
  });
  errorHandler.logError(!success, res);

  if (res.status === 201) {
    const body = JSON.parse(res.body);
    return body.id;
  }

  return null;
}

// Function to get statistics (admin only)
function getStats(token) {
  const params = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const res = http.get(`${BASE_URL}/admin/stats`, params);

  const success = check(res, {
    'statistics obtained': (r) => r.status === 200,
  });
  errorHandler.logError(!success, res);
}

// Main function that executes k6
export default function () {
  // Random decision of user type and behavior
  const userType = randomIntBetween(1, 100);

  // 15% Administrators
  if (userType <= 15) {
    // Administrator flow
    const adminToken = login(
      ADMIN_CREDENTIALS.email,
      ADMIN_CREDENTIALS.password,
    );

    if (adminToken) {
      // Create a restaurant
      const newRestaurantId = createRestaurant(adminToken);
      if (newRestaurantId) {
        createdRestaurantIds.push(newRestaurantId);
      }
      sleep(1);

      // Query statistics
      getStats(adminToken);
      sleep(1);

      // Get restaurants
      getRestaurants(adminToken);
      sleep(1);
    }
  }
  // 20% New users registering
  else if (userType <= 35) {
    // Register a new user
    const newUser = registerUser();
    sleep(1);

    if (newUser) {
      // Login with the new user
      const token = login(newUser.email, newUser.password);
      sleep(1);

      if (token) {
        // Explore restaurants
        restaurantIds = getRestaurants(token);
        sleep(1);

        if (restaurantIds && restaurantIds.length > 0) {
          // View restaurant details
          const randomRestaurantId = randomItem(restaurantIds);

          if (randomRestaurantId) {
            getRestaurant(randomRestaurantId, token);
            sleep(1);

            // Add to favorites
            addFavorite(token, randomRestaurantId);
            sleep(1);

            // Create a review
            createReview(token, randomRestaurantId);
            sleep(1);
          }
        }
      }
    }
  }
  // 35% Existing logged in users
  else if (userType <= 70) {
    const randomExistingUser = randomItem(existingUsers);

    const token = login(randomExistingUser.email, randomExistingUser.password);

    if (token) {
      // Get restaurants
      restaurantIds = getRestaurants(token);
      sleep(1);

      if (restaurantIds && restaurantIds.length > 0) {
        // View details of 2-3 restaurants
        const numToView = randomIntBetween(2, 3);
        for (let i = 0; i < numToView && i < restaurantIds.length; i++) {
          const restaurantId = restaurantIds[i];
          if (restaurantId) {
            getRestaurant(restaurantId, token);
            getReviews(restaurantId);
            sleep(0.5);
          }
        }

        // Query favorites
        let favorites = getFavorites(token);
        sleep(1);

        // Manage favorites more safely
        // 60% probability to add, 40% to remove
        const shouldAdd = randomIntBetween(1, 10) <= 6;

        if (shouldAdd) {
          // Add: choose a restaurant that is NOT in favorites
          const notInFavorites = restaurantIds.filter(
            (id) => !favorites || !favorites.includes(id),
          );
          if (notInFavorites.length > 0) {
            const restaurantToAdd = randomItem(notInFavorites);
            if (restaurantToAdd) {
              addFavorite(token, restaurantToAdd);
              favorites.push(restaurantToAdd);
              sleep(1);
            }
          }
        } else {
          // Remove: only if has favorites, choose from favorites list
          if (favorites && Array.isArray(favorites) && favorites.length > 0) {
            const restaurantToRemove = randomItem(favorites);
            if (restaurantToRemove && typeof restaurantToRemove === 'number') {
              removeFavorite(token, restaurantToRemove);
              favorites = favorites.filter((id) => id !== restaurantToRemove);
              sleep(1);
            }
          }
        }

        // Create a review randomly (50% probability)
        if (randomIntBetween(1, 2) === 1) {
          const reviewRestaurantId = randomItem(restaurantIds);
          if (reviewRestaurantId) {
            createReview(token, reviewRestaurantId);
            sleep(1);
          }
        }
      }
    }
  }
  // 30% Users without login (public navigation)
  else {
    // Navigation without authentication
    restaurantIds = getRestaurants();
    sleep(1);

    if (restaurantIds && restaurantIds.length > 0) {
      // View details of 1-2 restaurants
      const numToView = randomIntBetween(1, 2);
      for (let i = 0; i < numToView && i < restaurantIds.length; i++) {
        const restaurantId = randomItem(restaurantIds);
        if (restaurantId) {
          getRestaurant(restaurantId);
          getReviews(restaurantId);
          sleep(0.5);
        }
      }
    }
  }

  // Pause between iterations
  sleep(randomIntBetween(1, 3));
}
