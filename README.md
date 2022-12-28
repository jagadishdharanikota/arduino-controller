## **Running the application** ##

1. Running the application in local
    > npm ci
    
    > npm run start

2. Running the application in docker container
	> docker build -t express-srv-temple .

	> docker run -p 8000:8000 -d --name express-srv express-srv-temple



## **Setting up the environment** ##

It is always good to install node using package managers like homebrew in mac. Its easy to update and install it. Installing node using binary will is way complicated to uninstall it from mac.

### **Installing/ Uninstalling Node** ###

**Installing node using homebrew**
  >brew install node

**Reinstalling node using homebrew**
  >brew reinstall node

**Updating node using homebrew**
  >brew update node

**Uninstalling node using homebrew**
  >brew uninstall node

**Uninstalling Node installed using binary file**
  [Reference to uninstall](https://stackabuse.com/how-to-uninstall-node-js-from-mac-osx/)


### **Installing/ Uninstalling MongoDB** ###

**Installing MongoDB**

  [Reference for setting up mongodb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

**MongoDB References**

  [Code reference](https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html)

## **Describing package.json** ##

1. >npm start - starts the server in production mode
2. >npm dev - starts the server with environment variables preloaded from .env file
3. >npm test - runs the test for the application


## **Starting services using PM2** ##
1. Start the pm2 in development mode
    >pm2 start ecosystem.config.js --env development
2. Start the pm2 in development mode with watch
    >pm2 start ecosystem.config.js --env development --watch
3. Stop pm2 service
    >pm2 stop ecosystem.config.js
4. Check logs of a service running in pm2
    >pm2 logs <service_name>
5. Monitoring services
    >pm2 monit

## **Docker Commands** ##

1. Creating docker image
	>docker build -t express-srv-temple .

2. Running docker image with port mapping and naming a container
	>docker run -p 8000:8000 -d --name express-srv express-srv-temple

3. Running docker container and remove on exit
	>docker run --rm -p 8000:8000 -d express-srv-temple

4. Mapping local running mongo into dockarized node container
	>docker run -p 8000:8000 -d express-srv-temple -e ROOT_URL=http://localhost -e MONGO_URL=mongodb://localhost:27017

5. Starting a created container
	>docker start <container_name>

	_Eg. docker start express-srv

  ### References: 
  1. https://nodesource.com/blog/8-protips-to-start-killing-it-when-dockerizing-node-js

  ## **Learning Notes** ##

  ### **Debugging Node.js application** ###
  1. Debugging using commandline. Start the node with inspect option
    >node inspect <filename.js>

  2. Debugging using Chrome DevTools
    >node --inspect--brk <filename.js>

    >node --inspect <filename.js>

    Open chrome://inspect and check the remote target that lists out the debuggable file. Click on inspect and debug the code.

  3. Debugging in VS Code

    1. Click on Debug > Open Configurations and select Node.js environment
    2. Give the path of the file in the program attribute.
    3. Start debugging


### **Measuring Performance of Node.js application** ###
  1. Use following tools to do load testing of the services
      1. ab - apache bench - httpd:apache.org/docs/2.4/programs/ab.html
      2. httperf - github.com/httperf/httperf
      3. wrk - github.com/wg/wrk

  2. Profiling using Node
  >node --prof <filename.js>
  >ab -c 10 -n 100 http://localhost:8000/<route> - Sending load to server
  Log file is generated in current directory
  Isolate-0Xnnnnnnnnnn-v8.log
  >node --prof-process isolate-0Xnnnnnnnnnn-v8.log > profiler.txt


  ### **Logging libraries for Node** ###
  1. bunyan - Good
  2. debug
  3. log4js
  4. pino
  5. winston - Famous