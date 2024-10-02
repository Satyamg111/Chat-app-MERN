# Chat App (MERN Stack)

Welcome to the Chat App! This real-time chat application is built using the MERN stack (MongoDB, Express, React, and Node.js). It enables users to communicate instantly with each other.

## Features

- **Real-time Messaging:** Users can send and receive messages instantly with WebSocket technology.
- **User Authentication:** Secure user registration and login.
- **User Management:** Manage user profiles and settings.
- **Chat Rooms:** Create and join chat rooms for group discussions.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend:**
  - React.js
  - Socket.io-client
  - Bootstrap (or any other CSS framework)

- **Backend:**
  - Node.js
  - Express.js
  - Socket.io
  - MongoDB
  - Mongoose

## Installation

Follow these steps to set up and run the application locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Satyamg111/Chat-app-MERN.git
cd Chat-app-MERN
```
### 2. Set Up the Backend
  #### 1. Navigate to the server directory:
      ```bash
      cd server
      ```
  #### 2. Install the required dependencies:
      ```bash
      npm install
      ```
  #### 3. Create a .env file in the server directory with the following content:
      ```bash
      MONGODB_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      ```
  #### 4.Start the server:
      ```bash
      npm start
      ```
### 3. Set Up the Frontend
  #### 1. Navigate to the client directory:
      ```bash
      cd client
      ```
  #### 2. Install the required dependencies:
      ```bash
      npm install
      ```
  #### 3. Start the React application:
      ```bash
      npm start
      ```
### Usage

  #### 1. Open your browser and go to http://localhost:3000 to access the chat application.
    
  #### 2. Register a new account or log in with existing credentials.

  #### 3. Join a chat room or start a private conversation with other users.

### Contributing
We welcome contributions! If you find any issues or have suggestions for improvements, please follow these steps:
  #### 1. Fork the repository.
  #### 2. Create a new branch for your feature or bug fix.
  #### 3. Make your changes and commit them with descriptive messages.
  #### 4. Push your changes to your forked repository.
  #### 4. Open a pull request to the main repository.
  For detailed contributing guidelines, please refer to the CONTRIBUTING.md file (if available).

