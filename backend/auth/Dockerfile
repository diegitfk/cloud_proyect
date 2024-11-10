FROM python:3.12
WORKDIR /cloud_proyect/backend/auth
COPY requirements.txt /auth/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /auth/requirements.txt
COPY . /cloud_proyect/backend/auth
EXPOSE 8000
CMD [ "uvicorn" , "app:app" , "--host" , "0.0.0.0" , "--port" , "8000" , "--reload" ]