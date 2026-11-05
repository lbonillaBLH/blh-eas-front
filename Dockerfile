FROM node:24.22.2-alpine

COPY ./ /home/node
WORKDIR /home/node

RUN npm install
RUN npm install -g serve

### FOR RUN PRODUCTION ###

# CRA hornea las variables REACT_APP_* en el bundle durante "npm run build".
# Deben llegar como build-args (no sirve setearlas como env vars en Cloud Run:
# para entonces el bundle ya esta compilado). El trigger de Cloud Build corre
# en modo Dockerfile simple (sin cloudbuild.yaml) y no pasa --build-arg, asi
# que estos defaults son los que realmente se usan ahi - actualizarlos aqui
# si cambia el backend de QA. docker-compose.yml (build.args) los puede
# sobreescribir para desarrollo local.
ARG REACT_APP_BLH_EAS_API_BASE_URL=https://github-blh-eas-back-qa-228405537736.us-west1.run.app/
ARG REACT_APP_BLH_EAS_API_PATH_LOGIN=api/login
ARG REACT_APP_BLH_CURRENCY_API_BASE_URL=https://github-blh-currency-228405537736.us-central1.run.app
ARG REACT_APP_DEFAULT_ALLOW_FILES_MIMETYPES=application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.oasis.opendocument.spreadsheet,application/vnd.oasis.opendocument.text

ENV REACT_APP_BLH_EAS_API_BASE_URL=$REACT_APP_BLH_EAS_API_BASE_URL
ENV REACT_APP_BLH_EAS_API_PATH_LOGIN=$REACT_APP_BLH_EAS_API_PATH_LOGIN
ENV REACT_APP_BLH_CURRENCY_API_BASE_URL=$REACT_APP_BLH_CURRENCY_API_BASE_URL
ENV REACT_APP_DEFAULT_ALLOW_FILES_MIMETYPES=$REACT_APP_DEFAULT_ALLOW_FILES_MIMETYPES

EXPOSE 3000
RUN npm run build
CMD [ "serve", "-s", "build"]
