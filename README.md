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

The software is built to run with codedeploy. It is important to name the deployment group the same as the environment in which the software will run. An example deployment group name would be qe. This will automatically run the software with qe configurations.

 