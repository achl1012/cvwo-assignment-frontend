# Forum Flow

#### Created by: Amelia Chow
Forum Flow is a platform for online discussion where users can create, read, update and delete forum threads and comments. 
There is also a tagging system which allows users to easily categorize and search for threads of interest, improving the overall browsing experience.

## Setup Instructions
This application consists of two repositories: one for the **React frontend** and one for the **Go backend**. Follow the steps below to set up and run the application locally.

### Frontend Setup
1. **Clone the Frontend Repository**
   
   In your terminal, run the following command to clone the frontend repository:
   
   ```bash
   git clone https://github.com/achl1012/cvwo-assignment-frontend.git
   cd cvwo-assignment-frontend
   ```

2. **Install dependencies**

   Make sure you have `Node.js` and `npm` installed. If not, download and install them from [nodejs.org](url)
   
   Install the frontend dependencies:
   ```bash
   npm install
   ```

3. **Environment configuration**
   Create a `.env` file in the root of the frontend folder and set the following variables:
   ```.env
   VITE_API_URL=http://localhost:10000
   ```

4. **Run the frontend**
   Start the React development server:
   ```bash
   npm start
   ```
   
   Your frontend should now be running at http://localhost:10001

### Backend setup
1. **Clone the Backend Repository**
   
   In your terminal, run the following command to clone the backend repository:
   
   ```bash
   git clone https://github.com/achl1012/cvwo-assignment-backend.git
   cd cvwo-assignment-backend
   ```

2. **Install Go**
   
   Ensure you have Go installed on your computer. If not, follow the instructions from the official [Go website](https://go.dev/doc/install).

3. **Install dependencies**

   You can install necessary Go packages via:
   ```bash
   go mod tidy
   ```

4. **Set Up PostgreSQL Locally**

   If you don't have PostgreSQL installed, download and install it from [here](https://www.postgresql.org/download/).

   After installing, you can create a local PostgreSQL database and user as follows:

- **Start the PostgreSQL server**  
   Run the following command to start the PostgreSQL server (adjust the command based on your OS and PostgreSQL installation):

   ```bash
   pg_ctl -D /usr/local/var/postgres start  # Example for macOS
   ```

- **Access the PostgreSQL command line**

     Enter the following command:
     ```bash
     psql postgres
     ```
- **Create a new database and user**
  
     Run the following SQL commands to create a new database and user:
     ```sql
     CREATE DATABASE forumflow;
     CREATE USER yourusername WITH PASSWORD 'yourpassword';
     ALTER ROLE yourusername SET client_encoding TO 'utf8';
     ALTER ROLE yourusername SET default_transaction_isolation TO 'read committed';
     ALTER ROLE yourusername SET timezone TO 'UTC';
     GRANT ALL PRIVILEGES ON DATABASE forumflow TO yourusername;
     ```

5. **Configure `.env` file**

   Create a .env file in the root of the backend folder if it doesn't already exist.

   Set the DATABASE_URL variable to your local database credentials:
   ```.env
   DATABASE_URL=postgres://yourusername:yourpassword@localhost:5432/forumflow?sslmode=disable
   ```

   Note: Replace yourusername and yourpassword with the credentials you used to set up the database. If you're using a different host or port, make sure to adjust the URL accordingly.
   
7. **Run the backend**
   Start the Go backend server:
   ```bash
   go run cmd/server/main.go
   ```
   
   Your backend should now be running at http://localhost:10000


## Deployed Application

Forum Flow has also been deployed and is accessible online through Render. You can try it out at the following link:  
[**Forum Flow**](https://forumflow-frontend.onrender.com)

Note: The deployed app on Render may experience significant loading times due to the limitations of Render’s free subscription plan
   
