#TEST
________________________________

The server code is built with Node.js, and the database is handled using MongoDB and mongoose. 

<font size="1"> RESTful design was used in how the server handles all routing. </font>


Running instructions:

  - Set up the database:
    1. Open the terminal and navigate to the directory containing the source code.
    2. Within the project directory, create a folder named 'database' if one does not already exist.
    3. In the terminal, enter the following command:
            mongod --dbpath="/NAME_OF_THE_PATH_TO_THE_DATABASE_FOLDER_YOU_CREATED"
       This runs the mongo daemon.
  - Initialize the database:
    1. Open a second terminal, and navigate to the directory containing the source code.
    2. In the terminal, enter the following command:
            node MovieDatabaseInitializer.js
       This initializes the database.
  - Run the server:
    1. In the first terminal from the 'Set up the database' step, enter the following command:
            node ProjectServer.js
       This runs the server. Open a web browser, and enter the URL 'localhost:3000'
  - For more information, take a look at the included file titled 'Project Report' in the 'info' directory.
