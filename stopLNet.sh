set -e # Stop the script if any error occurs
sudo rm -r ${PWD}/{crypto,fabric,crypto-config,channel-artifacts/*};
docker-compose down; 
docker volume prune -f;