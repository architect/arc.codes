#!/bin/sh
# travis script deploy only accepts one script
# travis after_success won't deploy conditionally
# so we're doing this ಠ_ಠ
mkdir ~/.aws
printf "[jsf]\naws_access_key_id=${AWS_ACCESS_KEY_ID}\naws_secret_access_key=${AWS_SECRET_ACCESS_KEY}\nregion=us-west-2\n" > ~/.aws/credentials && 
npx deploy
rm -rf ~/.aws
