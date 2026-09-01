#set environment var LD_LIBRARY_PATH in consoloe of Cloud Run
export LD_LIBRARY_PATH=/usr/local/lib

#autenticate in gcloud for docker
gcloud auth configure-docker

#delete all containers
docker rm -f $(docker ps -a -q)

#delete all images
docker rmi -f $(docker images -aq)

#exportar las REACT_APP_* de deploy-vars.yml como variables de entorno, para que
#docker-compose las pase como build-args (React las hornea en el bundle en build
#time; setearlas solo como env vars de Cloud Run --como hacia el paso de abajo--
#no tiene efecto porque el bundle ya esta compilado para entonces).
set -a
while IFS= read -r line; do
  [ -z "$line" ] && continue
  key="${line%%:*}"
  value="${line#*: }"
  export "$key=$value"
done < deploy-vars.yml
set +a

#create image
docker-compose build --no-cache

#create image tag
docker tag blh-eas-front_blh-eas-front us-central1-docker.pkg.dev/cdn-storage-228019/prod/blh-eas-front:$1

#push image to reistry container of GCloud
docker push us-central1-docker.pkg.dev/cdn-storage-228019/prod/blh-eas-front:$1

#deploy simple revision in cloud run (no create and no change environemnt vars)
gcloud run deploy blh-eas-front \
--image=us-central1-docker.pkg.dev/cdn-storage-228019/prod/blh-eas-front:$1 \
--region=us-central1 \
--allow-unauthenticated \
--env-vars-file="deploy-vars.yml" \
--port=80