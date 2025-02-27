#!/bin/bash
CLIENT_ID=${1}
CLIENT_SECRET=${2}
export ENVIRONMENT=${3:-dev}
export DOMAIN=data.${ENVIRONMENT}.apps.health
SOURCE_DIR=${4:-'./synthea-data'}
echo 'Uploading bundles from directory ${SOURCE_DIR} to fhir using curl'
TOKEN_URL=https://${DOMAIN}/oauth2/token
echo "Params: $ENVIRONMENT $CLIENT_ID $CLIENT_SECRET"
# Get the token using the client_credentials flow
echo "Contacting ${TOKEN_URL} for an access token"
ACCESS_TOKEN=$(curl -k -s -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET" \
  $TOKEN_URL | jq -r '.access_token')
# process in batches of 20 using & and wait
COUNT=0
# Upload bundles
for filename in ${SOURCE_DIR}/*.json; do
  COUNT=$((COUNT+1))
  echo "Uploading : $filename"
  echo "====== Uploading data from file $filename =======" >> bundles.log
  # upload bundle authenticating with the access token and discard output to NUL
  curl -k -s -X POST --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header  "Content-Type:application/fhir+json" \
    --data @"$filename" https://${DOMAIN}/fhir/R4 > /dev/null &
  if [ $COUNT -eq 20 ]; then
    echo "Waiting for 20 uploads to complete..."
    wait
    COUNT=0
  fi
done
# wait for the last batch to complete
if [ $COUNT -ne 0 ]; then
  echo "Waiting for the last batch of $COUNT uploads to complete..."
  wait
fi
echo 'Upload complete.  See bundles.log for logs.'
 