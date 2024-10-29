#!bin/bash
# En este caso el compose ya debe de estar levantado como demonio
# Desde esa perspectiva podemos utilizar este script de bash para ejecutar una 
# serie de comandos que reiterativamente pueden llegar a ser un poco engorrosas.
# La combención del change continaers arrays es para todos loc contenedores que recibieron
# un cambio en le proceso de desarrollo cada nombre de contenedor definido en este 
# eliminara la imagen actual de este, y reconstruira el compose con los nuevos cambios



for arg in "$@"; do 
	if [[ "$arg" == "--help" ]]; then 
		echo "Uso del archivo gestor compose";
		echo "El archivo 'gestor-compose.sh' es un archivo que permite gestionar \n tanto en desarrollo como el momento de subir a producción \n la gestión del docker compsose \n permitiendo mayor flexibilidad al momento de tener que utilizar este compose."
		echo "Flags Obligatorias"
		echo -e  "\e[1m-build\e[0m. : Si desea recargar compose con el --build para los logs"
		echo -e "\e[1m-d\e[0m. : Si desea recargar el compose como demonio con -d";
		echo -e "\e[1m-rmcp\e[0m. : Si desea eliminar todas las imagenes que involucraron al compose";
		echo "Flags Opcionales"
		echo -e "\e[1m-rmdb\e[0m. : Eliminar todos los volumenes que actualmente se levantan de mongodb para el CloudDriving";
		echo "Patrones de Uso"
		echo -e "\e[1msudo CONTAINER_LIST='cloud:auth' sh ./reload-compose.sh -rmdb\e[0m"
		echo "En el caso de que usted necesie recargar el desarrollo actual en el compose si hizo cambios fuera del compose y quiere recargar cloud y auth en el compose y limpiar totalmente a la base de datos";
		echo -e "\e[1msudo CONTAINER_LIST='cloud:auth' sh ./gestor-compose.sh -d\e[0m";
		echo "En el caso de que usted necesite RECARGAR el compose si hizo cambios fuera de este y quiere afecten el compose con esta ejecución se levantara con docker compose up -d"
		echo -e "\e[1msudo CONTAINER_LIST='cloud:auth' sh ./gestor-compose.sh -build\e[0m";
		echo "En el caso de que usted necesite RECARGAR el compose\n si hizo cambios fuera de este y quieren que afecte\n al compose con esta ejecución se levantara con docker compose --build" 
		echo -e "\e[1msudo CONTAINER_LIST='cloud:auth' sh ./gestor-compose.sh -rmdb -rmcp\e[0m"		  
		echo "En el remoto caso que usted desee subir a producción el proyecto, este comando eliminara toda la permanencia de las bases de datos y todas las imagenes relacionadas con el compose."

		exit 0	
	fi
	change_containers="$CONTAINER_LIST";

	declare -A containers_imgs;
	containers_imgs["cloud"]="backend-cloud:latest";
	containers_imgs["auth"]="backend-auth:latest";

	IFS=':' read -r -a change_containers_array <<< "$change_containers";

	echo "Reloading Clouding Compose";
	echo "Bajando el compose....";

	docker compose down;
	echo "Compose fuera de funcionamiento";

	echo "Contenedores especificados que sufrieron cambios en el desarrollo";

	for container in "${change_containers_array[@]}"; do
		echo "A cambiado su contenido $container";
		echo "Removiendo la imagen del contenedor $container";
		sudo docker image remove "${containers_imgs["$container"]}";
		sleep 1;
	done
	

	if [[ "$arg" == "-rmdb" ]]; then
		echo "Removiendo el volumen del contenedor AUTH...";
		sudo rm -rf mongo_auth_p/;
		echo "Eliminado el volumen en ./mongo_auth_p";
		sleep 2;
		echo "Removiendo el volumen del contenedor CLOUD";
		sudo rm -rf mongo_cloud_p/;
		sleep 2;
		echo "Eliminado el volumne en ./mongo_cloud_p";
	fi

	if [[ "$arg" == "-build" ]]; then
		echo "Levantando el compose para visualizar logs";
		docker compose up --build;
		echo "Compose levantado correctamente";
		exit 0
	elif [[ "$arg" == "-d" ]]; then
		echo "Levantando el compose como demonio";
		docker compose up -d;
		echo "Compose levantado correctamente";
		exit 0
	
	elif [[ $arg == "-rmcp" ]]; then
		sudo docker image remove mongo:latest;
		sudo docker image remove nginx:latest;
		exit 0
	fi
	
done
if [[ $# -eq 0 ]]; then
	echo "Carencia de argumentos";
	echo "Debe utilizar: $0 [-rmdb](opcional) y [-build] o [-d](obligatorio)";	
fi
