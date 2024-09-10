# Metaverse Classroom

Metaverse Classroom is an innovative Next.js-based web application that provides an immersive learning experience in a virtual environment. It features user authentication, email-based login, and seamless integration with a metaverse learning platform.

## Features

- User authentication using Lucia
- Passwordless email-based login
- Interactive 3D learning environments
- QR code-based campus-wide challenge
- Question and answer system
- Responsive design for various devices

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Prisma with PostgreSQL
- Lucia for authentication
- Tailwind CSS for styling
- React Email for email templates
- Zod for input validation

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm or yarn
- PostgreSQL database

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-username/metaverse-classroom.git
   cd metaverse-classroom
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy the `example.env` file to `.env`
   - Fill in the necessary values in the `.env` file, including the `DATABASE_URL` and `LUCIA_AUTH_SECRET`

4. Set up the database:
   - Ensure your PostgreSQL server is running
   - Run Prisma migrations:
     ```
     npx prisma migrate dev
     ```

5. Start the development server:
   ```
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: React components, including email templates
- `/lib`: Utility functions and shared logic
- `/prisma`: Prisma schema and migrations
- `/public`: Static assets
- `/server-actions`: Server-side actions for form handling

## Key Components

- Authentication: Implemented using Lucia with Prisma adapter
- Email Service: Utilizes React Email for templating and Nodemailer for sending
- Database: PostgreSQL with Prisma ORM
- UI: Tailwind CSS for styling with custom components

## Contributing

Contributions to the Metaverse Classroom project are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Mason Wong - fpsmason2020@gmail.com
