import React from 'react';
import { 
  FiSearch, 
  FiUpload, 
  FiUsers, 
  FiShield, 
  FiAward, 
  FiTrendingUp, 
  FiSmartphone, 
  FiGlobe,
  FiHeart,
  FiMessageSquare,
  FiStar,
  FiCheckCircle
} from 'react-icons/fi';

const Features = () => {
  const mainFeatures = [
    {
      icon: FiSearch,
      title: 'Smart Item Discovery',
      description: 'Find exactly what you\'re looking for with our advanced search and filtering system. Browse by category, size, brand, condition, and more.',
      benefits: ['Advanced filters', 'Smart recommendations', 'Save favorite searches', 'Real-time updates']
    },
    {
      icon: FiUpload,
      title: 'Easy Item Listing',
      description: 'List your items in minutes with our streamlined upload process. Add multiple photos, detailed descriptions, and set your preferences.',
      benefits: ['Drag & drop uploads', 'Multiple photo support', 'Auto-categorization', 'Instant publishing']
    },
    {
      icon: FiUsers,
      title: 'Community Swapping',
      description: 'Connect with like-minded individuals who share your passion for sustainable fashion. Build relationships while swapping clothes.',
      benefits: ['User profiles', 'Rating system', 'Community guidelines', 'Safe interactions']
    },
    {
      icon: FiShield,
      title: 'Trust & Safety',
      description: 'Your safety is our priority. We have multiple layers of protection including user verification, secure messaging, and dispute resolution.',
      benefits: ['User verification', 'Secure messaging', 'Dispute resolution', '24/7 support']
    }
  ];

  const platformFeatures = [
    {
      icon: FiAward,
      title: 'Points System',
      description: 'Earn points for successful swaps and community participation. Use points to redeem items without offering anything in return.',
      benefits: ['Earn through swaps', 'Redeem for items', 'Community rewards', 'Loyalty program']
    },
    {
      icon: FiTrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track your swapping activity, points earned, and community impact with detailed analytics and insights.',
      benefits: ['Swap history', 'Points tracking', 'Impact metrics', 'Performance insights']
    },
    {
      icon: FiSmartphone,
      title: 'Mobile Optimized',
      description: 'Access ReWear anywhere, anytime with our fully responsive design that works perfectly on all devices.',
      benefits: ['Responsive design', 'Fast loading', 'Touch-friendly', 'Offline support']
    },
    {
      icon: FiGlobe,
      title: 'Global Community',
      description: 'Join a worldwide community of sustainable fashion enthusiasts. Connect with users from different cultures and backgrounds.',
      benefits: ['Worldwide reach', 'Cultural diversity', 'Local communities', 'Global impact']
    }
  ];

  const sustainabilityFeatures = [
    {
      icon: FiHeart,
      title: 'Environmental Impact',
      description: 'Every swap reduces textile waste and carbon footprint. Track your personal environmental impact and contribution to sustainability.',
      benefits: ['Waste reduction', 'Carbon footprint tracking', 'Environmental metrics', 'Impact reporting']
    },
    {
      icon: FiMessageSquare,
      title: 'Educational Content',
      description: 'Learn about sustainable fashion, circular economy, and how to make more conscious clothing choices.',
      benefits: ['Sustainability tips', 'Fashion guides', 'Circular economy education', 'Best practices']
    },
    {
      icon: FiStar,
      title: 'Quality Assurance',
      description: 'Our community guidelines ensure that only quality items are listed, promoting better experiences for all users.',
      benefits: ['Quality standards', 'Community moderation', 'Item verification', 'User reviews']
    },
    {
      icon: FiCheckCircle,
      title: 'Transparent Process',
      description: 'Complete transparency in all transactions. Know exactly what you\'re getting and who you\'re swapping with.',
      benefits: ['Clear communication', 'Transaction history', 'User feedback', 'Dispute transparency']
    }
  ];

  const FeatureCard = ({ feature }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <feature.icon className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 ml-3">{feature.title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{feature.description}</p>
      <ul className="space-y-2">
        {feature.benefits.map((benefit, index) => (
          <li key={index} className="flex items-center text-sm text-gray-600">
            <FiCheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Platform Features</h1>
            <p className="text-xl mb-8 leading-relaxed">
              Discover all the powerful features that make ReWear the ultimate platform for sustainable clothing exchange. 
              From smart discovery to secure swapping, we've built everything you need for a seamless experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="font-medium">10,000+ Items</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="font-medium">5,000+ Users</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="font-medium">95% Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to discover, list, and swap clothing items seamlessly
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced tools and systems that enhance your swapping experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {platformFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </div>

      {/* Sustainability Features */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sustainability Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Features designed to promote environmental consciousness and sustainable practices
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sustainabilityFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose ReWear?</h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Join thousands of users who are already making a difference
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="text-4xl font-bold mb-2">Free</div>
              <div className="text-green-100">No hidden fees or subscription costs</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold mb-2">Safe</div>
              <div className="text-green-100">Secure platform with user verification</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold mb-2">Sustainable</div>
              <div className="text-green-100">Reduce waste and environmental impact</div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">ReWear vs Traditional Shopping</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how swapping with ReWear compares to traditional clothing consumption
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 border-r border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Traditional Shopping</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      High environmental impact
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      Expensive new items
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      Fast fashion waste
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      Limited variety
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      No community aspect
                    </li>
                  </ul>
                </div>
                <div className="p-8 bg-green-50">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">ReWear Swapping</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Zero environmental impact
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Completely free
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Reduces textile waste
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Unique, one-of-a-kind items
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Build meaningful connections
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Start Swapping?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the ReWear community today and discover a new way to refresh your wardrobe while helping the planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Get Started Free
            </button>
            <button className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 