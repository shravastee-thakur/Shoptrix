

<img width="1265" height="593" alt="Shop1" src="https://github.com/user-attachments/assets/f5475c10-12bf-465c-b4e5-49c058cf0e68" />

<img width="1265" height="593" alt="Shop2" src="https://github.com/user-attachments/assets/080646f6-2b1f-44b0-bfd5-0f4aa16c8382" />


<img width="1259" height="587" alt="Shop3" src="https://github.com/user-attachments/assets/117eedda-039d-4228-949f-f05820d94728" />


# Shoptrix - MERN E-commerce Project

A full-stack e-commerce web application built with the MERN stack. This project handles user authentication, product management, cart functionality, orders, and more. It integrates key tools and libraries to provide a secure and scalable solution for online shopping. While the project is functional, I aim to refactor the code to make it more efficient and scalable.

### Features
- **User Authentication**: JWT-based authentication with 2FA and Role-Based Access Control (RBAC).

- **Product Management**: Add, update, and delete products.

- **Cart & Wishlist**: Users can manage their cart and wishlist.

- **Order Management**: Users can place orders, view order history, and track status.

- **Rate Limiting**: Prevent abuse using Upstash Redis for rate limiting and OTP storage.

- **File Uploads**: Product image uploads using Cloudinary.

- **Security**: Helmet for securing HTTP headers and Mongo-Sanitize for safe MongoDB queries.

- **Logging**: Winston for logging errors and activities.

### Security Features

- JWT Authentication: Secure routes with token-based authentication.

- 2FA: Two-factor authentication for added security.

- Rate Limiting: Prevent abuse using Upstash Redis.

- Role-Based Access Control (RBAC): Different roles (user, admin) with specific access privileges.

- Helmet: Secures HTTP headers to protect from common vulnerabilities.

- Mongo-Sanitize: Ensures safe MongoDB queries by sanitizing user inputs.

### Technologies Used

- Upstash Redis (Rate limiting & OTP storage)

- Cloudinary (For product image uploads)

- JWT (Authentication and Authorization)

- Joi (Data validation)

- Winston (Logging)

- Helmet (HTTP header security)

- Mongo-sanitize (Prevent MongoDB query injection)

### Known Issues

Payment gateway integration is yet to be added.

Some parts of the code may need further optimization and refactoring.

