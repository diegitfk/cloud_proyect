# cloud_proyect
Este es un proyecto que busca centralizar los archivos de una organización desde su red interna.
Este proyecto posee integración con las siguientes tecnologias:
### BackEnd
- Nginx: Un reverse proxy, load balancer y entre otras cosas sera utilizado, como entrada de solicitudes a una granja de servidores
- Docker: Una técnologia de punta para la manipulacion de contenedores con persistencia de datos, rapido y eficiente en recursos por sobre maquinas virtuales
- FastApi: Un framework util, minimalista y liberal para programas api rests. https://fastapi.tiangolo.com/
- Beanie : Un framework ODM Object Data Mapping, que permite una capa por encima de MongoDB para trabajar con este sistema gestos desde python. https://beanie-odm.dev/
- Python Libraries : Librerias varias de python como subprocess, typing , etc. para la ejecución de comando en shell desde el interprete de python. https://docs.python.org/3/library/subprocess.html
### FrontEnd

### Arquitectura del Proyecto
![Captura desde 2024-08-12 23-56-03](https://github.com/user-attachments/assets/22e4b410-bc9c-438a-a5c3-a625b531cc6a)
- Nginx: Esta servira de loadbalancer para que todas las solicitudes pasen por ellos
- Docker: Este levanta un contenedor con Fedora Linux, que servira una API Rest en FastAPI donde llegarán los archivos a subir, además organizara los archivos enviados de los usuarios así como restringira espacio de almacenamiento para los usuarios.
- MongoDB: Mantiene toda la lógica del login así como el id de las carpeta de los usuarios.
#### Como organizamos la información de los usuarios?
Con un orden en carpeta!, supongamos cada usuario se registra en nuestra aplicación,
recibe una carpeta en un sistema operativo, solamente cerrada en espacio para el, es por ello
que se propone la siguiente arquitectura de estructuras de directorios

![Captura desde 2024-08-12 23-28-42](https://github.com/user-attachments/assets/5ac4645d-7516-4338-806e-34c6073e516d)

Esto es debatible, es solamente una propuesta.




