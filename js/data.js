/* ==========================================================================
   Portfolio Configuration & Editable Data
   Update your personal links, contact endpoint, and project entries below.
   ========================================================================== */

window.PORTFOLIO_CONFIG = {
  ownerName: 'V. Bhanu',
  degree: 'B.Tech',
  year: '1st Year',
  careerGoal: 'Aspiring Software Developer',
  email: 'bhanuvakiti8@gmail.com',
  githubUrl: 'https://github.com/bhanu0208',
  linkedinUrl: 'https://www.linkedin.com/in/vakiti-bhanu0208',

  education: {
    degreeFull: 'Bachelor of Technology (B.Tech)',
    period: '1st Year · Current',
    institution: 'Joy University',
    location: 'Kanyakumari, Tamil Nadu',
    branch: 'CSE (AI & ML)'
  },

  /*
   * Contact Form Integration Options:
   * 1. Local Dev Server: Leave both fields empty ('') and run via serve.ps1 (uses POST /api/contact).
   * 2. Formspree (Static Hosting): Set formspreeEndpoint to 'https://formspree.io/f/YOUR_FORM_ID'.
   * 3. Web3Forms (Static Hosting): Set web3formsKey to your public Web3Forms access key.
   */
  contactForm: {
    formspreeEndpoint: '',
    web3formsKey: '',
    localApiEndpoint: '/api/contact'
  }
};

/*
 * Placeholder Projects:
 * Replace these starter templates with your real projects as you build them.
 */
window.PROJECTS_DATA = {
  'responsive-portfolio': {
    id: 'responsive-portfolio',
    badge: 'Placeholder Project 01',
    title: 'Developer Portfolio Architecture',
    summary:
      'A placeholder showcase demonstrating a responsive, accessible multi-section web layout built with semantic HTML5, modern CSS Grid/Flexbox, and vanilla JavaScript interactivity.',
    stack: ['HTML5', 'CSS3', 'JavaScript'],
    githubUrl: 'https://github.com/bhanu0208', // Replace with specific repo URL once published
    highlights: [
      'Semantic document structure with keyboard navigation and ARIA landmarks.',
      'Modular CSS custom properties for consistent dark-theme spacing and gradients.',
      'IntersectionObserver scroll reveal and responsive mobile drawer navigation.'
    ]
  },
  'python-cli-tracker': {
    id: 'python-cli-tracker',
    badge: 'Placeholder Project 02',
    title: 'Python Study & Task Tracker CLI',
    summary:
      'A starter project template designed for practicing Python file handling, structured functions, and command-line input validation for daily coursework tracking.',
    stack: ['Python', 'JSON Storage', 'CLI'],
    githubUrl: 'https://github.com/bhanu0208', // Replace with specific repo URL once published
    highlights: [
      'Clean modular functions for adding, listing, and completing study tasks.',
      'Local JSON persistence with defensive error handling for malformed input.',
      'Built as a customizable starter concept until personal projects are added.'
    ]
  },
  'c-algorithms-lab': {
    id: 'c-algorithms-lab',
    badge: 'Placeholder Project 03',
    title: 'C Fundamentals & Logic Lab',
    summary:
      'A placeholder repository template organizing foundational C programming exercises covering arrays, pointers, structures, and core sorting or searching algorithms.',
    stack: ['C Programming', 'Data Structures', 'Algorithms'],
    githubUrl: 'https://github.com/bhanu0208', // Replace with specific repo URL once published
    highlights: [
      'Structured problem sets practicing memory addressing and pointer safety.',
      'Step-by-step implementations of iterative and recursive logic patterns.',
      'Ready to be replaced with your completed B.Tech lab repositories.'
    ]
  }
};

