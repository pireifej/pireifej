#!/bin/bash

echo "Install ..."

sudo cp -Rf /home/pireifej/pireifej/sherri/* /var/www/html/pireifej/sherri
sudo chown -R www-data /var/www/html/pireifej/sherri

# sherri
echo "sherri install ..."
for file in /var/www/html/pireifej/sherri/*; do
    if [ ${file: -5} == ".html" ]
    then
       sudo sed -i '/{{header-main}}/{
    	 s/{{header-main}}//g
    	 r /var/www/html/pireifej/sherri/header-main.html
	 }' $file

       sudo sed -i '/{{header-mobile}}/{
    	 s/{{header-mobile}}//g
    	 r /var/www/html/pireifej/sherri/header-mobile.html
	 }' $file
       
       sudo sed -i '/{{about-me}}/{
    	 s/{{about-me}}//g
    	 r /var/www/html/pireifej/sherri/about-me.html
	 }' $file

       sudo sed -i '/{{footer}}/{
    	 s/{{footer}}//g
    	 r /var/www/html/pireifej/sherri/footer.html
	 }' $file
    fi
done

echo "Done"
