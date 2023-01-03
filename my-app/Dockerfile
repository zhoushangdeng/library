FROM node:15
 
WORKDIR /my-app
COPY . /my-app
 
RUN rm -f package.json \
; rm -rf node_modules \
&& npm install
 
RUN npm install pm2 -g
 
EXPOSE 7001

CMD npm run dev