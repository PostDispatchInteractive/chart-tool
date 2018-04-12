https://github.com/PostDispatchInteractive/chart-tool-pd

This repo contains our private clone of Chart Tool, with P-D specific customizations. This document explains how to administer our custom Chart Tool installation.

# Administering the Post-Dispatch's Chart Tool

## I. How to reboot the Chart Tool server

Follow these steps when the Chart Tool server becomes unresponsive or gives an error.

1. SSH into the server: `ssh root@charts.post-dispatch.com`
	* Only certain users whose SSH keys have been copied to the server can do this:
		- Josh Renaud
		- Janelle O'Dea
		- Andrew Nguyen
		- Dave Dierker
2. Once connected, issue a reboot command: `sudo shutdown -r now`
3. You will immediately be disconnected. Wait a couple minutes. Chart Tool should be working now.



## II. How to deploy a Chart Tool upgrade

Deploying a Chart Tool upgrade involves many steps, including settling differences between our customizations and changes from G&M that might overwrite those. I don't recommend folks besides Josh Renaud do this. But I'm documenting the steps here for posterity and cases of emergency.
These steps can be completed ONLY by users listed in I.1 above, since their SSH keys are registered on the various servers.

1. Where everything lives
	* `https://github.com/PostDispatchInteractive/chart-tool`
		- Our local fork of Chart Tool. From this repo we can propose pull requests, or we can pull down new code from the Globe and Mail. This repo needs to stay identical to the G&M repo, unless we're proposing a pull request.
	* `https://github.com/PostDispatchInteractive/chart-tool-pd`
		- Our CUSTOMIZED clone of Chart Tool, with Post-Dispatch-specific settings.
		- The `/custom/` folder contains our P-D fonts, URLs, print output settings, and other things. Do NOT delete or change these.
2. How to pull down and merge an upgrade
	* Pull changes from G&M chart-tool to local chart-tool fork
		- Change to fork's directory: `cd chart-tool`
		- Pull changes from G&M, then push to local fork repo: `git pull upstream master && git push origin master`
	* Pull changes from local chart-tool fork to customized chart-tool-pd
		- Change to chart-tool-pd directory: `cd ..` and `cd chart-tool`
		- Make a backup copy of customizations: `cp -R custom ~/Desktop/custom/`
		- Try to pull changes from local chart-tool fork: `git pull upstream master`
			- If you get an error like this: "Your local changes to the following files would be overwritten by merge", then stash those changes (`git stash`) and repeat the pull.
			- If it asks you to write a merge message, put something like "Merging G&M changes from Nov. 2". Press [esc], type ":wq", then press [enter] to save.
	* Check if changes affect `/custom/` directory. 
		- After the pull, you should see a list of changed files on the command line. Most will be within `/meteor/`. If any are within `/custom/`, do the following steps.
		- Open each changed `chart-tool-pd/custom/` file in a text editor, and compare it with its equivalent in the backup `Desktop/custom/` you made earlier.
		- Often the only changes will be additions: new JSON fields, etc. If that's the case, we're finished.
		- If there are CHANGES to fields that have P-D-specific values, then add back our P-D values to the `/chart-tool-pd/custom/` version of the file. Examples:
			- `  help: 'http://staging.graphics.stltoday.com/apps/docs-charttool/',`
			- `  "embedJS": "//graphics.stltoday.com/bin/chart-tool/1.2.2-0/chart-tool.min.js"`
			- `    "prefix": "SOURCE: "`
			- Almost anything in the .scss files
	* Now that we have pulled down updates and integrated our customizations, save the changes.
		- Make a commit and push changes to chart-tool-pd repo: 
			- `git add .`
			- `git commit -m "Upgrading to new Chart Tool code"`
			- `git push origin master`
3. How to build new Chart Tool code and deploy to server
	* You should still be in the `/chart-tool-pd/` directory
	* Build bundle with new server code: `gulp build`
	* Change to the new bundle's directory:
		- Change to distribution folder: `cd dist`
		- Note the highest-numbered version folder you see after running this command: `ls -la`
		- Change to that highest-numbered version folder. For example: `cd 1.2.3-0`
	* Transfer meteor.tar.gz to Chart Tool server.
		- `rsync -vaz meteor/meteor.tar.gz charttool@charts.post-dispatch.com:/home/charttool/`
	* Transfer .js and .css to Graphics server.
		- (Make sure version number listed in following command matches the version number in the `embedJS` field at the bottom of `/custom/chart-tool-config.json`.)
		- `rsync -vaz chart-tool.min.{css,js} newsroom@graphics.stltoday.com:/home/newsroom/graphics.stltoday.com/public_html/bin/chart-tool/1.2.3-0/`
	* Unzip and deploy new code on Chart Tool server.
		- SSH to server: `ssh charttool@charts.post-dispatch.com`
		- Run Josh's install script: `./install-ct.sh`
		- Exit SSH session: `exit`
		- Follow steps I.1 through I.3 to reboot the server.
	* DONE!

## III. Miscellaneous server settings

There are two users on the server: `root` and `charttool`

The root user is used for making changes to the server config, or for rebooting the machine. The charttool user owns and executes the Chart Tool meteor app.

### Home directories

* charttool: `/home/chartool/`
* root: `/root/`

### nginx

The Chart Tool machine uses `nginx` as its web server. 

To change the web server settings, edit this file: `/etc/nginx/sites-available/chart-tool`

Things you can do: 
* Limit IP ranges that can access the server (currently only IP ranges within Lee Enterprises are allowed access)
* Configure proxy headers that get passed to Meteor


### Upstart

This is a system for starting tasks on boot. We use one of these to initialize the Chart Tool Meteor app, and load specific environment variables.

To change the charttool task, edit this file: `/etc/init/chart-tool.conf`


### Mongo DB

The Mongo conf files are:
* `/etc/mongod.conf`
* `/etc/mongodb.conf`


