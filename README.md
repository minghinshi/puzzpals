# puzzpals
A Japanese logic puzzle website where you can solve the same puzzle with others in real time.

## Install

1. Set up .env files in both client and server
2. Run npm i in both directories
3. Run npm run dev in the client, and run npm run dev in the server. The packages are built automatically when the server is run, and automatically rebuilds whenever a change is detected


### About DB

This project uses sqlite to store puzzle data. It is automatically created at `puzzpals-data.db`. To reset the db simply delete the file.