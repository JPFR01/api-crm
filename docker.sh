docker build -t apiexample .

docker run -p 3001:3001/tcp apiexample

docker run --rm -it -p 3001:3001/tcp apiexample:latest /bin/sh
