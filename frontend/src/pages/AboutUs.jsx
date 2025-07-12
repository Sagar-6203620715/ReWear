import React from 'react';
import { FiUsers, FiHeart, FiShield, FiTrendingUp, FiAward, FiGlobe } from 'react-icons/fi';

const AboutUs = () => {
  const stats = [
    { number: '10,000+', label: 'Items Swapped', icon: FiTrendingUp },
    { number: '5,000+', label: 'Happy Users', icon: FiUsers },
    { number: '50+', label: 'Cities Covered', icon: FiGlobe },
    { number: '95%', label: 'Satisfaction Rate', icon: FiAward }
  ];

  const values = [
    {
      icon: FiHeart,
      title: 'Sustainability',
      description: 'We believe in reducing textile waste and promoting circular fashion for a greener planet.'
    },
    {
      icon: FiUsers,
      title: 'Community',
      description: 'Building a supportive community where people can share and exchange clothing items.'
    },
    {
      icon: FiShield,
      title: 'Trust & Safety',
      description: 'Ensuring secure transactions and authentic items through our verification system.'
    },
    {
      icon: FiTrendingUp,
      title: 'Innovation',
      description: 'Continuously improving our platform with cutting-edge technology and user feedback.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Passionate about sustainable fashion and building communities that make a difference.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Technology enthusiast focused on creating seamless user experiences and scalable solutions.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Head of Operations',
      bio: 'Operations expert dedicated to ensuring smooth platform operations and user satisfaction.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">About ReWear</h1>
            <p className="text-xl mb-8 leading-relaxed">
              We're on a mission to revolutionize the way people think about clothing. 
              By creating a sustainable community where items find new homes instead of landfills, 
              we're building a future where fashion is both stylish and responsible.
            </p>
            <div className="flex justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-lg font-semibold">Founded in 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              To create a sustainable clothing ecosystem where every item has the opportunity to find a new home. 
              We believe that by connecting people who want to give their clothes a second life with those who 
              are looking for unique pieces, we can significantly reduce textile waste and promote conscious consumption.
            </p>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Problem We're Solving</h3>
              <p className="text-gray-600 mb-6">
                The fashion industry is one of the largest polluters globally, with millions of tons of clothing 
                ending up in landfills each year. Many of these items are still in excellent condition and could 
                bring joy to someone else.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-2">92M</div>
                  <div className="text-sm text-gray-600">Tons of textile waste annually</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">73%</div>
                  <div className="text-sm text-gray-600">Of clothing ends up in landfills</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">95%</div>
                  <div className="text-sm text-gray-600">Could be reused or recycled</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do at ReWear
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="flex justify-center mb-4">
                  <value.icon className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind ReWear's mission to create a sustainable fashion future
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-green-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="text-3xl font-bold mb-2">2,500+</div>
              <div className="text-green-100">Items Saved from Landfills</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold mb-2">15,000+</div>
              <div className="text-green-100">kg CO2 Emissions Reduced</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold mb-2">₹50L+</div>
              <div className="text-green-100">Value of Items Swapped</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Join the Movement</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Be part of the solution. Start swapping clothes today and help us create a more sustainable future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Start Swapping
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

export default AboutUs; 