# VideoTube Backend 🎥

A comprehensive video hosting platform backend built with Node.js, Express.js, and MongoDB. This project implements a complete YouTube-like video sharing service with modern backend practices and security features.

## 🚀 Features

### User Management
- ✅ User registration and authentication
- ✅ JWT-based access and refresh tokens
- ✅ Password encryption with bcrypt
- ✅ User profile management
- ✅ Avatar and cover image upload

### Video Management
- ✅ Video upload and processing
- ✅ Video metadata management
- ✅ Thumbnail generation
- ✅ Video watch history
- ✅ Video search and filtering

### Social Features
- ✅ Like/Dislike videos
- ✅ Comment system with replies
- ✅ Subscribe/Unsubscribe to channels
- ✅ User playlists
- ✅ Tweet-like posts

### Additional Features
- ✅ Dashboard analytics
- ✅ Health check endpoints
- ✅ File upload with Cloudinary
- ✅ Pagination support
- ✅ CORS enabled
- ✅ Cookie-based session management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Password Hashing**: bcrypt
- **Environment Management**: dotenv
- **Development**: Nodemon

## 📦 Dependencies

```json
{
  "bcrypt": "^5.1.1",
  "cloudinary": "^1.41.0",
  "cookie-parser": "^1.4.6",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.0.0",
  "mongoose-aggregate-paginate-v2": "^1.0.6",
  "mongoose-paginate-v2": "^1.9.0",
  "multer": "^1.4.5-lts.1"
}
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chai-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/videotube
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=your-access-token-secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:8000`

## 📁 Project Structure

```
src/
├── controllers/         # Route handlers
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   ├── playlist.controller.js
│   ├── subscription.controller.js
│   ├── tweet.controller.js
│   └── dashboard.controller.js
├── models/             # Database schemas
│   ├── user.model.js
│   ├── video.model.js
│   ├── comment.model.js
│   ├── like.model.js
│   ├── playlist.model.js
│   ├── subscription.model.js
│   └── tweet.model.js
├── routes/             # API routes
│   ├── user.routes.js
│   ├── video.routes.js
│   └── ...
├── middlewares/        # Custom middleware
│   ├── auth.middleware.js
│   └── multer.middleware.js
├── utils/              # Utility functions
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   ├── cloudinary.js
│   └── deleteOldAsset.js
├── db/                 # Database connection
│   └── index.js
├── app.js              # Express app setup
└── index.js            # Server entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh-token` - Refresh access token

### Users
- `GET /api/v1/users/current-user` - Get current user
- `PATCH /api/v1/users/update-account` - Update account details
- `PATCH /api/v1/users/avatar` - Update avatar
- `PATCH /api/v1/users/cover-image` - Update cover image

### Videos
- `POST /api/v1/videos` - Upload video
- `GET /api/v1/videos` - Get all videos
- `GET /api/v1/videos/:videoId` - Get video by ID
- `PATCH /api/v1/videos/:videoId` - Update video
- `DELETE /api/v1/videos/:videoId` - Delete video

### Comments, Likes, Subscriptions, Playlists
- Complete CRUD operations for all social features
- Proper pagination and filtering

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS**: Cross-origin resource sharing enabled
- **Environment Variables**: Sensitive data protection
- **Input Validation**: Mongoose schema validation
- **Error Handling**: Centralized error management

## 🧪 Testing

The project includes health check endpoints for monitoring:
- `GET /api/v1/healthcheck` - Service health status

## 📊 Database Models

The application uses MongoDB with the following main models:
- **User**: User accounts and authentication
- **Video**: Video content and metadata
- **Comment**: User comments on videos
- **Like**: Like/dislike functionality
- **Subscription**: Channel subscriptions
- **Playlist**: User-created playlists
- **Tweet**: Social media posts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Mayank Sharma**

---

⭐ Star this repository if you found it helpful!