#!/bin/bash

echo "Install ..."

sudo cp -Rf /home/pireifej/pireifej/sherri/* /var/www/html/pireifej/sherri
sudo chown -R www-data /var/www/html/pireifej/sherri

# sherri
echo "sherri install ..."
for file in /var/www/html/pireifej/sherri/*; do
    if [ ${file: -5} == ".html" ]
    then
       sudo sed -i '/{{header}}/{
    	 s/{{header}}//g
    	 r /var/www/html/pireifej/sherri/header.html
	 }' $file
       
       sudo sed -i '/{{preloader}}/{
    	 s/{{preloader}}//g
    	 r /var/www/html/pireifej/sherri/preloader.html
	 }' $file

    fi
done

echo "Done"
