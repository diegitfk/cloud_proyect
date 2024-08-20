FROM fedora:latest
RUN dnf install -y python3 python3-pip git make
WORKDIR /cloud_proyect
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000