FROM node:22-alpine AS builder 


# --- ENV

# From --build-arg flag
# Example use
# docker build -t your-harbor-domain.com/my-project/my-react-app:latest . \
#  --build-arg VITE_API_URL=$VITE_API_URL \
#  --build-arg VITE_APP_TITLE=$VITE_APP_TITLE \
#  --build-arg NODE_ENV=production



ARG VITE_API_BASE_URL
ARG VITE_CLMS_BASE_URL
ARG VITE_LINK_LINE_OA_URL


ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_CLMS_BASE_URL=$VITE_CLMS_BASE_URL
ENV VITE_LINK_LINE_OA_URL=$VITE_LINK_LINE_OA_URL

ENV NODE_OPTIONS="--max_old_space_size=4096"


##
WORKDIR /app 

COPY package*.json ./
RUN npm ci 

COPY . . 

RUN npm run build:no-tsc 


# --- Stage 2: Serve with Production NGINX ---
FROM nginx:alpine 

# Copy the custom NGINX configuration file 
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html 

EXPOSE 80 

# start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]