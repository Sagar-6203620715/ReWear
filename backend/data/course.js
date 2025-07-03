const courses = [
  {
    "name": "MadeEasy Aptitude",
    "price": 4215,
    "image": {
      "url": "https://picsum.photos/seed/course1/500/300",
      "altText": "MadeEasy Aptitude"
    },
    "duration": {
      "years": 0,
      "months": 4
    },
    "affiliate_link": "https://www.udemy.com/course/madeeasy-aptitude/",
    "rating": 3.7,
    "domainName": "Aptitude",
    "sectionName": "Competitive Exams",
    "dimensions": {
      "length": 12,
      "width": 8,
      "height": 4
    },
    "weight": 1.2
  },
  {
    "name": "R.S. Aggarwal Aptitude",
    "price": 2013,
    "image": {
      "url": "https://picsum.photos/seed/course2/500/300",
      "altText": "R.S. Aggarwal Aptitude"
    },
    "duration": {
      "years": 0,
      "months": 11
    },
    "affiliate_link": "https://www.amazon.in/Quantitative-Aptitude-R-S-Aggarwal/dp/9351343088/",
    "rating": 4.6,
    "domainName": "Aptitude",
    "sectionName": "Competitive Exams",
    "dimensions": {
      "length": 14,
      "width": 5,
      "height": 2
    },
    "weight": 0.8
  },
  {
    "name": "Testbook Aptitude",
    "price": 5079,
    "image": {
      "url": "https://picsum.photos/seed/course3/500/300",
      "altText": "Testbook Aptitude"
    },
    "duration": {
      "years": 1,
      "months": 8
    },
    "affiliate_link": "https://testbook.com/aptitude-courses",
    "rating": 4.3,
    "domainName": "Aptitude",
    "sectionName": "Competitive Exams",
    "dimensions": {
      "length": 18,
      "width": 7,
      "height": 4
    },
    "weight": 0.6
  },
  {
    "name": "BYJU Reasoning",
    "price": 4803,
    "image": {
      "url": "https://picsum.photos/seed/course4/500/300",
      "altText": "BYJU Reasoning"
    },
    "duration": {
      "years": 1,
      "months": 12
    },
    "affiliate_link": "https://example.com/byju-reasoning",
    "rating": 4.3,
    "domainName": "Logical Reasoning",
    "sectionName": "Competitive Exams",
    "dimensions": {
      "length": 13,
      "width": 6,
      "height": 2
    },
    "weight": 0.8
  },
  {
    "name": "Unacademy Reasoning",
    "price": 7354,
    "image": {
      "url": "https://picsum.photos/seed/course5/500/300",
      "altText": "Unacademy Reasoning"
    },
    "duration": {
      "years": 1,
      "months": 6
    },
    "affiliate_link": "https://example.com/unacademy-reasoning",
    "rating": 4.5,
    "domainName": "Logical Reasoning",
    "sectionName": "Competitive Exams",
    "dimensions": {
      "length": 13,
      "width": 9,
      "height": 2
    },
    "weight": 1.0
  },
  {
    "name": "CrackReasoning Pro",
    "price": 5750,
    "image": {
      "url": "https://picsum.photos/seed/course6/500/300",
      "altText": "CrackReasoning Pro"
    },
    "duration": {
      "years": 1,
      "months": 12
    },
    "affiliate_link": "https://example.com/crackreasoning-pro",
    "rating": 4.6,
    "domainName": "Logical Reasoning",
    "sectionName": "Competitive Exams",
    "dimensions": {
      "length": 16,
      "width": 10,
      "height": 4
    },
    "weight": 0.4
  },
  {
    "name": "Quant Champ",
    "price": 2281,
    "image": {
      "url": "https://picsum.photos/seed/course7/500/300",
      "altText": "Quant Champ"
    },
    "duration": {
      "years": 0,
      "months": 12
    },
    "affiliate_link": "https://example.com/quant-champ",
    "rating": 4.5,
    "domainName": "Quantitative Aptitude",
    "sectionName": "Competitive Exams",
    "dimensions": {
      "length": 18,
      "width": 9,
      "height": 5
    },
    "weight": 1.3
  },
  {
    "name": "Excel Maths",
    "price": 3129,
    "image": {
      "url": "https://picsum.photos/seed/course8/500/300",
      "altText": "Excel Maths"
    },
    "duration": {
      "years": 0,
      "months": 10
    },
    "affiliate_link": "https://example.com/excel-maths",
    "rating": 4.7,
    "domainName": "Quantitative Aptitude",
    "sectionName": "Competitive Exams",
    "dimensions": {
      "length": 12,
      "width": 5,
      "height": 5
    },
    "weight": 0.7
  },
  {
    "name": "Top Rankers Quant",
    "price": 7407,
    "image": {
      "url": "https://picsum.photos/seed/course9/500/300",
      "altText": "Top Rankers Quant"
    },
    "duration": {
      "years": 1,
      "months": 5
    },
    "affiliate_link": "https://example.com/top-rankers-quant",
    "rating": 3.6,
    "domainName": "Quantitative Aptitude",
    "sectionName": "Competitive Exams",
    "dimensions": {
      "length": 18,
      "width": 7,
      "height": 4
    },
    "weight": 0.6
  },
  {
    "name": "CodeWithHarry Bootcamp",
    "price": 4667,
    "image": {
      "url": "https://picsum.photos/seed/course10/500/300",
      "altText": "CodeWithHarry Bootcamp"
    },
    "duration": {
      "years": 1,
      "months": 9
    },
    "affiliate_link": "https://www.codewithharry.com/courses/",
    "rating": 3.8,
    "domainName": "Web Development",
    "sectionName": "Tech",
    "dimensions": {
      "length": 14,
      "width": 5,
      "height": 3
    },
    "weight": 0.3
  },
  {
    "name": "Udemy React",
    "price": 3793,
    "image": {
      "url": "https://picsum.photos/seed/course11/500/300",
      "altText": "Udemy React"
    },
    "duration": {
      "years": 0,
      "months": 3
    },
    "affiliate_link": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
    "rating": 4.4,
    "domainName": "Web Development",
    "sectionName": "Tech",
    "dimensions": {
      "length": 15,
      "width": 5,
      "height": 3
    },
    "weight": 1.5
  },
  {
    "name": "Coursera Web",
    "price": 2295,
    "image": {
      "url": "https://picsum.photos/seed/course12/500/300",
      "altText": "Coursera Web"
    },
    "duration": {
      "years": 1,
      "months": 5
    },
    "affiliate_link": "https://example.com/coursera-web",
    "rating": 4.0,
    "domainName": "Web Development",
    "sectionName": "Tech",
    "dimensions": {
      "length": 14,
      "width": 9,
      "height": 3
    },
    "weight": 0.6
  },
  {
    "name": "Scaler DSA",
    "price": 2707,
    "image": {
      "url": "https://picsum.photos/seed/course13/500/300",
      "altText": "Scaler DSA"
    },
    "duration": {
      "years": 0,
      "months": 6
    },
    "affiliate_link": "https://example.com/scaler-dsa",
    "rating": 4.8,
    "domainName": "Data Structures",
    "sectionName": "Tech",
    "dimensions": {
      "length": 18,
      "width": 9,
      "height": 3
    },
    "weight": 0.5
  },
  {
    "name": "GFG Data Structures",
    "price": 6760,
    "image": {
      "url": "https://picsum.photos/seed/course14/500/300",
      "altText": "GFG Data Structures"
    },
    "duration": {
      "years": 0,
      "months": 11
    },
    "affiliate_link": "https://example.com/gfg-data-structures",
    "rating": 4.3,
    "domainName": "Data Structures",
    "sectionName": "Tech",
    "dimensions": {
      "length": 15,
      "width": 6,
      "height": 5
    },
    "weight": 0.4
  },
  {
    "name": "Coding Ninjas DSA",
    "price": 6951,
    "image": {
      "url": "https://picsum.photos/seed/course15/500/300",
      "altText": "Coding Ninjas DSA"
    },
    "duration": {
      "years": 0,
      "months": 7
    },
    "affiliate_link": "https://example.com/coding-ninjas-dsa",
    "rating": 4.5,
    "domainName": "Data Structures",
    "sectionName": "Tech",
    "dimensions": {
      "length": 19,
      "width": 5,
      "height": 3
    },
    "weight": 0.6
  },
  {
    "name": "Andrew Ng ML",
    "price": 2707,
    "image": {
      "url": "https://picsum.photos/seed/course16/500/300",
      "altText": "Andrew Ng ML"
    },
    "duration": {
      "years": 1,
      "months": 6
    },
    "affiliate_link": "https://example.com/andrew-ng-ml",
    "rating": 4.0,
    "domainName": "Machine Learning",
    "sectionName": "Tech",
    "dimensions": {
      "length": 20,
      "width": 5,
      "height": 3
    },
    "weight": 0.7
  },
  {
    "name": "ML Masterclass",
    "price": 4236,
    "image": {
      "url": "https://picsum.photos/seed/course17/500/300",
      "altText": "ML Masterclass"
    },
    "duration": {
      "years": 1,
      "months": 4
    },
    "affiliate_link": "https://example.com/ml-masterclass",
    "rating": 3.9,
    "domainName": "Machine Learning",
    "sectionName": "Tech",
    "dimensions": {
      "length": 20,
      "width": 9,
      "height": 5
    },
    "weight": 1.5
  },
  {
    "name": "Kaggle Learn",
    "price": 3329,
    "image": {
      "url": "https://picsum.photos/seed/course18/500/300",
      "altText": "Kaggle Learn"
    },
    "duration": {
      "years": 1,
      "months": 3
    },
    "affiliate_link": "https://example.com/kaggle-learn",
    "rating": 5.0,
    "domainName": "Machine Learning",
    "sectionName": "Tech",
    "dimensions": {
      "length": 11,
      "width": 6,
      "height": 3
    },
    "weight": 0.8
  },
  {
    "name": "Ethical Hacking Intro",
    "price": 4261,
    "image": {
      "url": "https://picsum.photos/seed/course19/500/300",
      "altText": "Ethical Hacking Intro"
    },
    "duration": {
      "years": 1,
      "months": 12
    },
    "affiliate_link": "https://example.com/ethical-hacking-intro",
    "rating": 3.9,
    "domainName": "Cybersecurity",
    "sectionName": "Tech",
    "dimensions": {
      "length": 16,
      "width": 8,
      "height": 5
    },
    "weight": 1.0
  },
  {
    "name": "CyberSafe Pro",
    "price": 6558,
    "image": {
      "url": "https://picsum.photos/seed/course20/500/300",
      "altText": "CyberSafe Pro"
    },
    "duration": {
      "years": 0,
      "months": 4
    },
    "affiliate_link": "https://example.com/cybersafe-pro",
    "rating": 4.1,
    "domainName": "Cybersecurity",
    "sectionName": "Tech",
    "dimensions": {
      "length": 10,
      "width": 8,
      "height": 5
    },
    "weight": 0.3
  },
  {
    "name": "Udemy CyberSec",
    "price": 5144,
    "image": {
      "url": "https://picsum.photos/seed/course21/500/300",
      "altText": "Udemy CyberSec"
    },
    "duration": {
      "years": 0,
      "months": 9
    },
    "affiliate_link": "https://example.com/udemy-cybersec",
    "rating": 4.3,
    "domainName": "Cybersecurity",
    "sectionName": "Tech",
    "dimensions": {
      "length": 14,
      "width": 10,
      "height": 2
    },
    "weight": 0.5
  },
  {
    "name": "SpeakUp",
    "price": 5823,
    "image": {
      "url": "https://picsum.photos/seed/course22/500/300",
      "altText": "SpeakUp"
    },
    "duration": {
      "years": 0,
      "months": 6
    },
    "affiliate_link": "https://example.com/speakup",
    "rating": 4.2,
    "domainName": "English Communication",
    "sectionName": "Skills",
    "dimensions": {
      "length": 20,
      "width": 7,
      "height": 4
    },
    "weight": 1.0
  },
  {
    "name": "FluentU",
    "price": 4688,
    "image": {
      "url": "https://picsum.photos/seed/course23/500/300",
      "altText": "FluentU"
    },
    "duration": {
      "years": 1,
      "months": 9
    },
    "affiliate_link": "https://example.com/fluentu",
    "rating": 5.0,
    "domainName": "English Communication",
    "sectionName": "Skills",
    "dimensions": {
      "length": 20,
      "width": 6,
      "height": 2
    },
    "weight": 0.8
  },
  {
    "name": "Duolingo Pro",
    "price": 7827,
    "image": {
      "url": "https://picsum.photos/seed/course24/500/300",
      "altText": "Duolingo Pro"
    },
    "duration": {
      "years": 0,
      "months": 5
    },
    "affiliate_link": "https://example.com/duolingo-pro",
    "rating": 4.9,
    "domainName": "English Communication",
    "sectionName": "Skills",
    "dimensions": {
      "length": 10,
      "width": 7,
      "height": 5
    },
    "weight": 1.2
  },
  {
    "name": "Stage Mastery",
    "price": 3642,
    "image": {
      "url": "https://picsum.photos/seed/course25/500/300",
      "altText": "Stage Mastery"
    },
    "duration": {
      "years": 1,
      "months": 10
    },
    "affiliate_link": "https://example.com/stage-mastery",
    "rating": 4.1,
    "domainName": "Public Speaking",
    "sectionName": "Skills",
    "dimensions": {
      "length": 16,
      "width": 9,
      "height": 2
    },
    "weight": 0.8
  },
  {
    "name": "TED Talks Course",
    "price": 6314,
    "image": {
      "url": "https://picsum.photos/seed/course26/500/300",
      "altText": "TED Talks Course"
    },
    "duration": {
      "years": 0,
      "months": 5
    },
    "affiliate_link": "https://example.com/ted-talks-course",
    "rating": 4.1,
    "domainName": "Public Speaking",
    "sectionName": "Skills",
    "dimensions": {
      "length": 12,
      "width": 9,
      "height": 5
    },
    "weight": 0.7
  },
  {
    "name": "SpeakEasy",
    "price": 5585,
    "image": {
      "url": "https://picsum.photos/seed/course27/500/300",
      "altText": "SpeakEasy"
    },
    "duration": {
      "years": 0,
      "months": 3
    },
    "affiliate_link": "https://example.com/speakeasy",
    "rating": 4.9,
    "domainName": "Public Speaking",
    "sectionName": "Skills",
    "dimensions": {
      "length": 19,
      "width": 5,
      "height": 2
    },
    "weight": 1.2
  },
  {
    "name": "WriteWell",
    "price": 4988,
    "image": {
      "url": "https://picsum.photos/seed/course28/500/300",
      "altText": "WriteWell"
    },
    "duration": {
      "years": 0,
      "months": 12
    },
    "affiliate_link": "https://example.com/writewell",
    "rating": 4.8,
    "domainName": "Creative Writing",
    "sectionName": "Skills",
    "dimensions": {
      "length": 11,
      "width": 6,
      "height": 3
    },
    "weight": 0.5
  },
  {
    "name": "Author Lab",
    "price": 4735,
    "image": {
      "url": "https://picsum.photos/seed/course29/500/300",
      "altText": "Author Lab"
    },
    "duration": {
      "years": 1,
      "months": 11
    },
    "affiliate_link": "https://example.com/author-lab",
    "rating": 4.2,
    "domainName": "Creative Writing",
    "sectionName": "Skills",
    "dimensions": {
      "length": 10,
      "width": 9,
      "height": 4
    },
    "weight": 1.1
  },
  {
    "name": "Poet\u2019s Touch",
    "price": 7925,
    "image": {
      "url": "https://picsum.photos/seed/course30/500/300",
      "altText": "Poet\u2019s Touch"
    },
    "duration": {
      "years": 0,
      "months": 10
    },
    "affiliate_link": "https://example.com/poet\u2019s-touch",
    "rating": 3.7,
    "domainName": "Creative Writing",
    "sectionName": "Skills",
    "dimensions": {
      "length": 14,
      "width": 9,
      "height": 2
    },
    "weight": 1.3
  },
  {
    "name": "Physics Galaxy",
    "price": 7079,
    "image": {
      "url": "https://picsum.photos/seed/course31/500/300",
      "altText": "Physics Galaxy"
    },
    "duration": {
      "years": 1,
      "months": 12
    },
    "affiliate_link": "https://example.com/physics-galaxy",
    "rating": 4.1,
    "domainName": "Class 12 - PCM",
    "sectionName": "School",
    "dimensions": {
      "length": 11,
      "width": 6,
      "height": 2
    },
    "weight": 0.4
  },
  {
    "name": "MathsTopper",
    "price": 7500,
    "image": {
      "url": "https://picsum.photos/seed/course32/500/300",
      "altText": "MathsTopper"
    },
    "duration": {
      "years": 1,
      "months": 9
    },
    "affiliate_link": "https://example.com/mathstopper",
    "rating": 4.8,
    "domainName": "Class 12 - PCM",
    "sectionName": "School",
    "dimensions": {
      "length": 12,
      "width": 7,
      "height": 4
    },
    "weight": 1.3
  },
  {
    "name": "Chemistry King",
    "price": 6993,
    "image": {
      "url": "https://picsum.photos/seed/course33/500/300",
      "altText": "Chemistry King"
    },
    "duration": {
      "years": 0,
      "months": 3
    },
    "affiliate_link": "https://example.com/chemistry-king",
    "rating": 4.2,
    "domainName": "Class 12 - PCM",
    "sectionName": "School",
    "dimensions": {
      "length": 17,
      "width": 10,
      "height": 4
    },
    "weight": 1.1
  },
  {
    "name": "BioGenius",
    "price": 4307,
    "image": {
      "url": "https://picsum.photos/seed/course34/500/300",
      "altText": "BioGenius"
    },
    "duration": {
      "years": 1,
      "months": 10
    },
    "affiliate_link": "https://example.com/biogenius",
    "rating": 5.0,
    "domainName": "Class 11 - PCB",
    "sectionName": "School",
    "dimensions": {
      "length": 11,
      "width": 5,
      "height": 3
    },
    "weight": 1.5
  },
  {
    "name": "PhysicsWallah 11",
    "price": 5553,
    "image": {
      "url": "https://picsum.photos/seed/course35/500/300",
      "altText": "PhysicsWallah 11"
    },
    "duration": {
      "years": 0,
      "months": 8
    },
    "affiliate_link": "https://example.com/physicswallah-11",
    "rating": 4.9,
    "domainName": "Class 11 - PCB",
    "sectionName": "School",
    "dimensions": {
      "length": 12,
      "width": 7,
      "height": 3
    },
    "weight": 0.5
  },
  {
    "name": "NEETPrep",
    "price": 4128,
    "image": {
      "url": "https://picsum.photos/seed/course36/500/300",
      "altText": "NEETPrep"
    },
    "duration": {
      "years": 1,
      "months": 9
    },
    "affiliate_link": "https://example.com/neetprep",
    "rating": 4.6,
    "domainName": "Class 11 - PCB",
    "sectionName": "School",
    "dimensions": {
      "length": 13,
      "width": 5,
      "height": 4
    },
    "weight": 1.3
  },
  {
    "name": "Vedic Maths",
    "price": 7396,
    "image": {
      "url": "https://picsum.photos/seed/course37/500/300",
      "altText": "Vedic Maths"
    },
    "duration": {
      "years": 1,
      "months": 6
    },
    "affiliate_link": "https://example.com/vedic-maths",
    "rating": 4.8,
    "domainName": "Math Foundation",
    "sectionName": "School",
    "dimensions": {
      "length": 11,
      "width": 8,
      "height": 5
    },
    "weight": 0.6
  },
  {
    "name": "Foundation X",
    "price": 6090,
    "image": {
      "url": "https://picsum.photos/seed/course38/500/300",
      "altText": "Foundation X"
    },
    "duration": {
      "years": 0,
      "months": 6
    },
    "affiliate_link": "https://example.com/foundation-x",
    "rating": 4.3,
    "domainName": "Math Foundation",
    "sectionName": "School",
    "dimensions": {
      "length": 11,
      "width": 9,
      "height": 3
    },
    "weight": 1.0
  },
  {
    "name": "Early Algebra",
    "price": 7250,
    "image": {
      "url": "https://picsum.photos/seed/course39/500/300",
      "altText": "Early Algebra"
    },
    "duration": {
      "years": 1,
      "months": 10
    },
    "affiliate_link": "https://example.com/early-algebra",
    "rating": 3.6,
    "domainName": "Math Foundation",
    "sectionName": "School",
    "dimensions": {
      "length": 11,
      "width": 6,
      "height": 2
    },
    "weight": 1.4
  }
];

module.exports = courses;
