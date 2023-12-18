#!/bin/bash

echo "Install ..."

sudo cp -Rf /home/pireifej/pireifej/* /var/www/html/pireifej/
sudo chown -R www-data /var/www/html/pireifej

# pireifej
echo "pireifej install ..."
for file in /var/www/html/pireifej/*; do
    if [ ${file: -5} == ".html" ]
    then
       sudo sed -i '/{{header}}/{
    	 s/{{header}}//g
    	 r /var/www/html/pireifej/header.html
	 }' $file
       
       sudo sed -i '/{{preloader}}/{
    	 s/{{preloader}}//g
    	 r /var/www/html/pireifej/preloader.html
	 }' $file

    fi
done

echo "Done"
