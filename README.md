# ReWear – Community Clothing Exchange

A modern, responsive web application that enables users to exchange unused clothing through direct swaps or a point-based redemption system. The goal is to promote sustainable fashion and reduce textile waste by encouraging users to reuse wearable garments instead of discarding them.

## 🚀 Feature

### Core Feature
- **Item Discovery**: Browse clothing items by categories, sizes, and styles
- **Advanced Filtering**: Sort items by size, brand, condition, style, and more
- **Item Ratings & Reviews**: Rate and review clothing items with detailed feedback
- **Responsive Design**: Fully responsive design that works on all devices
- **Admin Panel**: Comprehensive admin interface for managing content

### User Features
- **User Authentication**: Secure login/register system with JWT
- **Direct Swaps**: Exchange clothing items directly with other users
- **Point System**: Earn and redeem points for clothing exchanges
- **Search Functionality**: Advanced search with filters
- **Mobile-First Design**: Optimized for mobile and tablet devices
- **User Dashboard**: Manage profile, items, and swap history
- **Image Upload**: Upload item images with Cloudinary integration

### Admin Features
- **User Management**: Manage user accounts and permissions
- **Item Moderation**: Approve, reject, or remove inappropriate items
- **Analytics Dashboard**: View platform statistics and user activity
- **Content Moderation**: Moderate items and user content

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Icons** - Icon library
- **Axios** - HTTP client
- **Swiper** - Touch slider component

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
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
   cd Course-Comparator
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   PORT=9000
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
   VITE_BACKEND_URL=http://localhost:9000
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

This will create:
- Sample users (including admin user)
- Sample clothing items
- Initial database structure

## 🚀 Development

### Available Scripts

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with initial data
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
Course-Comparator/
├── backend/
│   ├── data/
│   │   └── items.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Item.js
│   │   ├── Swap.js
│   │   ├── Subscriber.js
│   │   └── Users.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── swapRoutes.js
│   │   ├── subscriberRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   ├── seeder.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   ├── Common/
│   │   │   ├── Items/
│   │   │   ├── Layout/
│   │   │   └── User/
│   │   ├── pages/
│   │   ├── redux/
│   │   │   └── slices/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔧 Key Features Implementation

### Item Management
- **Browse Items**: View all available clothing items with filtering and sorting
- **Item Details**: Detailed view with image gallery, description, and uploader info
- **List Items**: Upload new items with images and descriptions
- **Item Status**: Track item availability and swap status

### Swap System
- **Request Swaps**: Send swap requests to item owners
- **Manage Swaps**: View ongoing and completed swaps
- **Swap History**: Track all swap activities
- **Points System**: Earn points for successful swaps

### User System
- **Authentication**: Secure login/register with JWT
- **User Profiles**: Manage personal information and preferences
- **Dashboard**: Overview of items, swaps, and points
- **Role-based Access**: Different permissions for users and admins

### Admin Panel
- **Item Moderation**: Approve/reject new item listings
- **User Management**: Manage user accounts and permissions
- **Analytics**: View platform statistics and user activity
- **Content Management**: Remove inappropriate content

## 🌟 Getting Started

1. **Clone and setup the project** (see Installation section)
2. **Configure environment variables** for both frontend and backend
3. **Start the backend server** (`npm run dev` in backend directory)
4. **Start the frontend server** (`npm run dev` in frontend directory)
5. **Seed the database** (`npm run seed` in backend directory)
6. **Access the application** at `http://localhost:5173`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for sustainability and community building
- Promotes circular fashion economy
