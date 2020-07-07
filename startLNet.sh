set -e # Stop the script if any error occurs
./myscripts/create-crypto.sh
./myscripts/create-genesis.sh
docker-compose down; docker volume prune -f; docker-compose up
./myscripts/createChannel.sh
