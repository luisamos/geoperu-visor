FROM nginx:latest
ARG APP_DIR=/var/www/html
ENV APP_DIR=${APP_DIR}
RUN apk add --no-cache bash

FROM base as production
WORKDIR ${APP_DIR}
COPY --chown=nginx:nginx . .
ENTRYPOINT ["/bin/bash", "deployment/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]