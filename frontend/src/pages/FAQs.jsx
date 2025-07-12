import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';

const FAQs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I create an account on ReWear?',
          answer: 'Creating an account is simple! Click on the "Register" button in the top navigation, fill in your details including name, email, and password, and you\'ll be ready to start swapping clothes in no time.'
        },
        {
          question: 'Is ReWear free to use?',
          answer: 'Yes, ReWear is completely free to use! You can browse items, create listings, and participate in swaps without any cost. We believe sustainable fashion should be accessible to everyone.'
        },
        {
          question: 'What types of clothing can I list on ReWear?',
          answer: 'You can list any clothing item that\'s in good condition - from casual wear to formal attire, accessories, shoes, and more. We encourage items that are clean, well-maintained, and accurately described.'
        }
      ]
    },
    {
      category: 'Swapping & Transactions',
      questions: [
        {
          question: 'How does the swapping process work?',
          answer: 'When you find an item you like, you can request a direct swap with one of your items. The item owner will review your request and can accept, decline, or propose a counter-offer.'
        },
        {
          question: 'How do I handle shipping and delivery?',
          answer: 'Once a swap is agreed upon, both parties are responsible for shipping their items. We recommend using tracked shipping and communicating clearly about delivery timelines. Always take photos of items before shipping for protection.'
        },
        {
          question: 'What if I receive an item that doesn\'t match the description?',
          answer: 'If an item doesn\'t match its description, contact our support team immediately. We have a dispute resolution process to help resolve issues. Always communicate with the other party first to try to resolve the issue amicably.'
        }
      ]
    },
    {
      category: 'Safety & Trust',
      questions: [
        {
          question: 'How do you ensure the safety of users?',
          answer: 'We have several safety measures in place: user verification, review systems, secure messaging, and a dedicated support team. We also encourage users to meet in public places for local swaps and use secure payment methods.'
        },
        {
          question: 'What should I do if I encounter inappropriate behavior?',
          answer: 'If you encounter inappropriate behavior, report it immediately through our reporting system. You can block users and our support team will investigate all reports to maintain a safe community environment.'
        },
        {
          question: 'Are my personal details secure?',
          answer: 'Yes, we take data security seriously. Your personal information is encrypted and we never share your details with third parties without your consent. We use industry-standard security measures to protect your data.'
        }
      ]
    },
    {
      category: 'Account & Profile',
      questions: [
        {
          question: 'How do I update my profile information?',
          answer: 'Go to your dashboard and click on "Edit Profile" to update your personal information, profile picture, and preferences. You can also manage your listed items and swap history from your dashboard.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account at any time from your profile settings. Please note that this action is permanent and will remove all your data, including listings and swap history.'
        },
        {
          question: 'How do I reset my password?',
          answer: 'If you\'ve forgotten your password, click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a link to reset your password securely.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'The app is not loading properly. What should I do?',
          answer: 'Try refreshing the page or clearing your browser cache. If the issue persists, check your internet connection and try using a different browser. If problems continue, contact our technical support team.'
        },
        {
          question: 'How do I upload photos of my items?',
          answer: 'When creating a listing, you can upload photos by clicking the upload area. We support JPG, PNG, and WebP formats. For best results, use clear, well-lit photos that show the item from multiple angles.'
        },
        {
          question: 'I\'m having trouble with the messaging system. Help!',
          answer: 'Make sure you\'re logged in and have a stable internet connection. Try refreshing the page or logging out and back in. If the issue continues, contact our support team with details about the problem.'
        }
      ]
    },
    {
      category: 'Community Guidelines',
      questions: [
        {
          question: 'What are the community guidelines?',
          answer: 'Our community guidelines promote respect, honesty, and safety. Be truthful in your listings, treat others with respect, follow local laws, and help maintain a positive environment for everyone.'
        },
        {
          question: 'Can I sell items for money on ReWear?',
          answer: 'No, ReWear is designed for swapping and exchanging items, not for monetary sales. This helps us maintain our mission of promoting sustainable fashion and reducing waste.'
        },
        {
          question: 'What happens if I violate the community guidelines?',
          answer: 'Violations are reviewed by our moderation team. Depending on the severity, actions may include warnings, temporary suspension, or permanent account removal. We aim to maintain a safe and respectful community.'
        }
      ]
    }
  ];

  // Filter FAQs based on search term
  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about using ReWear. Can't find what you're looking for? 
              <a href="/contact" className="text-green-600 hover:text-green-700 font-medium ml-1">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                <h2 className="text-xl font-semibold text-green-800">{category.category}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {category.questions.map((faq, questionIndex) => {
                  const itemIndex = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openItems.has(itemIndex);
                  
                  return (
                    <div key={questionIndex} className="px-6 py-4">
                      <button
                        onClick={() => toggleItem(itemIndex)}
                        className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-lg p-2 -m-2"
                      >
                        <h3 className="text-lg font-medium text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        {isOpen ? (
                          <FiChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <FiChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="mt-4 pl-2">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any FAQs matching "{searchTerm}". Try different keywords or contact our support team.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Contact Support */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Still Need Help?</h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Contact Support
              </a>
              <a
                href="mailto:info@rewear.com"
                className="border border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs; 