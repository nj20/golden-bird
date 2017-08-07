# Golden Bird

This software is the back-end of an ordering app for restaurants. 

## Running the software

1. Install nodejs and npm.
2. Install newman through npm
3. Run the following script in sequence
	* stop.sh
	* start.sh
	* test.sh
4. Each of the scripts takes in DEPLOYMENT\_GROUP\_NAME as environment variable. This variable describes the environment in which the code will run. It can either be qe, stage or prod. Example: DEPLOYMENT\_GROUP\_NAME=qe start.sh
5. All the configuration for each environment is in the config folder. You can simply add a new environment by adding a new configuration folder

## Deploying with AWS CodeDeploy

The software is built to run with codedeploy.

1. Create and setup new codedeploy project.
2. Link the codedeploy to the github project.
3. Name the deployment group name as qe/stage/production
4. The configuration for each of these environments are available in node/config folder.

## Structure Of Code 

The code follows a MVC pattern. The API calls are redirected to middlewares where functions like authentications are performed and then are redirected to the routes where the api calls are processed. The routes make calls to controllers which inturn make calls to database. 

 