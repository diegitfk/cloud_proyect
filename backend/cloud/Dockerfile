#docker run -it -p 8000:8000  --name fedora-cloud -v /home/diegocancino/Escritorio/python/cloud_proyect/backend/cloud:/cloud_proyect/backend/cloud cloud-server
FROM fedora:latest
RUN dnf install -y python3 python3-pip git make attr
WORKDIR /cloud_proyect/backend/cloud
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . /cloud_proyect/backend/cloud
EXPOSE 8000
RUN mkdir /cloud_root && mkdir /cloud_transfer
CMD [ "uvicorn" , "app:app" , "--reload" , "--host" , "0.0.0.0" , "--port" , "8000" ]
