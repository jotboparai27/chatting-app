
file structue for FrontEnd

chat-app-frontend/
├── public/                    # Static files
│   ├── index.html             # Main HTML template
│   ├── favicon.ico            # App favicon
│   └── manifest.json          # PWA configuration
├── src/                       # Main application code
│   ├── assets/                # Static assets (images, fonts, etc.)
│   │   ├── images/            # Images for the app
│   │   ├── icons/             # Icons used in the app
│   │   └── fonts/             # Custom fonts
│   ├── components/            # Reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.js      # Button component
│   │   │   └── Button.module.css # Styles for Button
│   │   ├── ChatBubble/
│   │   │   ├── ChatBubble.js  # Chat bubble component
│   │   │   └── ChatBubble.module.css # Styles for ChatBubble
│   │   └── Sidebar/
│   │       ├── Sidebar.js     # Sidebar component
│   │       └── Sidebar.module.css # Styles for Sidebar
│   ├── context/               # Context providers for global state
│   │   ├── AuthContext.js     # Authentication context
│   │   └── ChatContext.js     # Chat-related context
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.js         # Hook for authentication
│   │   └── useChat.js         # Hook for chat functionality
│   ├── pages/                 # Page components
│   │   ├── Login/
│   │   │   ├── Login.js       # Login page
│   │   │   └── Login.module.css # Styles for Login
│   │   ├── Register/
│   │   │   ├── Register.js    # Register page
│   │   │   └── Register.module.css # Styles for Register
│   │   ├── ChatRoom/
│   │   │   ├── ChatRoom.js    # Chatroom page
│   │   │   └── ChatRoom.module.css # Styles for ChatRoom
│   │   ├── Profile/
│   │   │   ├── Profile.js     # User profile page
│   │   │   └── Profile.module.css # Styles for Profile
│   │   └── NotFound/
│   │       ├── NotFound.js    # 404 Not Found page
│   │       └── NotFound.module.css # Styles for NotFound
│   ├── services/              # API calls and backend communication
│   │   ├── api.js             # API base setup
│   │   ├── authService.js     # Authentication-related APIs
│   │   └── chatService.js     # Chat-related APIs
│   ├── styles/                # Global and reusable styles
│   │   ├── variables.css      # CSS variables (colors, fonts, etc.)
│   │   ├── global.css         # Global styles for the app
│   │   └── themes/            # Light and dark mode themes
│   ├── utils/                 # Utility functions and helpers
│   │   ├── dateFormatter.js   # Format dates for display
│   │   ├── validators.js      # Validation functions
│   │   └── socket.js          # Socket.IO setup
│   ├── App.js                 # Main application component
│   ├── index.js               # Application entry point
│   └── reportWebVitals.js     # Performance monitoring (optional)
├── package.json               # Project dependencies and scripts
└── README.md                  # Project documentation


mongo db commands


to start
brew services start mongodb/brew/mongodb-community@6.0

to stop 
brew services stop mongodb/brew/mongodb-community@6.0

