#set -e # Stop the script if any error occurs
sudo rm -r ${PWD}/{crypto,fabric,crypto-config,channel-artifacts/*};
docker-compose down; 
docker volume prune -f;
# rm ./sampleapp/middleware/fabric-artifacts/hlf-connection-profile.json
echo "Removing previous hyperledger/dev-peer (chaincode) containers to avoid possibility of conflicts (Recommended by Fabric documentation)"
cids=$(docker ps -a | grep -P 'hyperledger|dev-peer' | awk '{ print $1 }')
for id in $cids
do
	docker stop $id;
	docker rm $id;
done
if [ $? -ne 0 ]
then 
	echo "Could not remove containers. Please try this yourself and read the error: docker rm $(docker ps -aq) -f"
	exit;
fi

echo "Removing previous chaincode image and volumes to avoid possibility of conflicts (Recommended by Fabric documentation)"
docker volume prune -f
docker rmi -f $(docker images -q -f "reference=dev-*")
if [ $? -ne 0 ]
then 
	echo "Could not remove chaincode image (dev-peer...). Please try this yourself and read the error: docker rmi $(grep 'dev') -f "
	exit;
fi 

