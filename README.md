## File Uploading Service: Uploading to AWS S3

Even though the repository is named "File Uploading", it turns out that it's specifically for Image Uploading. When calling the Uploading API with the image file, it will covert it to webp file, reduce the file size if it's too large, and then upload it to AWS S3. There are also APIs that respond with the stream data of the image file. Additionally, any irregular errors that occur will be sent to Discord.

Tech Stack:

- Fastify
- TypeScript
- PostgreSQL
- AWS S3
- Docker
