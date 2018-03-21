# `npm run create`

Reads `.arc` and generates AWS infrastructure if it does not already exist. This method can throw errors related to AWS account throttling. If this happens just wait a few seconds are re-run the command. This command is intended to be run and re-run as you develop your app and modify the corosponding `.arc` file.
