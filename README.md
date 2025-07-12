# ReWear – Community Clothing Exchange

A modern, responsive web application that enables users to exchange unused clothing through direct swaps or a point-based redemption system. The goal is to promote sustainable fashion and reduce textile waste by encouraging users to reuse wearable garments instead of discarding them.

## 🚀 Features

### Core Features
- **Clothing Discovery**: Browse clothing items by categories, sizes, and styles
- **Advanced Filtering**: Sort items by size, brand, condition, style, and more
- **Real-time Chat**: Discuss clothing items with other users in category-specific chat rooms
- **Item Ratings & Reviews**: Rate and review clothing items with detailed feedback
- **Responsive Design**: Fully responsive design that works on all devices
- **Admin Panel**: Comprehensive admin interface for managing content

### User Features
- **User Authentication**: Secure login/register system with JWT
- **Clothing Comparison**: Compare clothing items side-by-side
- **Direct Swaps**: Exchange clothing items directly with other users
- **Point System**: Earn and redeem points for clothing exchanges
- **Search Functionality**: Advanced search with filters
- **Mobile-First Design**: Optimized for mobile and tablet devices

### Admin Features
- **User Management**: Manage user accounts and permissions
- **Clothing Management**: Add, edit, and delete clothing items
- **Category Management**: Organize clothing by categories
- **Section Management**: Categorize clothing into sections
- **Content Moderation**: Moderate reviews and discussions

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Icons** - Icon library
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Swiper** - Touch slider component

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Cloudinary** - Image upload and management
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (local or cloud instance)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd course_comparator
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

### Initial Data Seeding
```bash
cd backend
npm run seed
```

### Create Admin User
```bash
cd backend
npm run make-admin
```

## 🚀 Development

### Available Scripts

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with initial data
- `npm run make-admin` - Create admin user
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

### Project Structure

```
rewear/
├── backend/
│   ├── config/
│   │   └── db.js
│   │   ├── data/
│   │   │   ├── clothing.js
│   │   │   ├── category.js
│   │   │   └── section.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── Chat.js
│   │   │   ├── Clothing.js
│   │   │   ├── Category.js
│   │   │   ├── Review.js
│   │   │   ├── Section.js
│   │   │   ├── Subscriber.js
│   │   │   └── Users.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   ├── clothingAdminRoutes.js
│   │   │   ├── clothingRoutes.js
│   │   │   ├── categoryAdminRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── sectionRoutes.js
│   │   │   ├── subscriberRoutes.js
│   │   │   ├── uploadRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── server.js
│   │   └── package.json
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Admin/
│   │   │   │   ├── Chat/
│   │   │   │   ├── Common/
│   │   │   │   ├── Clothing/
│   │   │   │   └── Layout/
│   │   │   │   ├── pages/
│   │   │   │   ├── redux/
│   │   │   │   │   └── slices/
│   │   │   │   ├── assets/
│   │   │   │   ├── App.jsx
│   │   │   │   └── main.jsx
│   │   │   │   ├── package.json
│   │   │   │   └── vite.config.js
│   │   │   └── README.md
│   └── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `NODE_ENV` - Environment (development/production)

#### Frontend (.env)
- `VITE_BACKEND_URL` - Backend API URL

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Rate limiting
- Input validation
- XSS protection

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Build the application
3. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔄 Updates

Stay updated with the latest features and improvements by:
- Following the repository
- Checking the releases page
- Reading the changelog

---

**Built with ❤️ by the ReWear Team**