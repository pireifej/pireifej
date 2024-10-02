#!/bin/bash

echo "Install ..."

sudo cp -Rf /home/pireifej/pireifej/northernstars/* /var/www/html/pireifej/northernstars
sudo chown -R www-data /var/www/html/pireifej/northernstars

# northernstars
echo "northernstars install ..."
for file in /var/www/html/pireifej/northernstars/*; do
    if [ ${file: -5} == ".html" ]
    then
       sudo sed -i '/{{header-main}}/{
    	 s/{{header-main}}//g
    	 r /var/www/html/pireifej/northernstars/header-main.html
	 }' $file

       sudo sed -i '/{{header-mobile}}/{
    	 s/{{header-mobile}}//g
    	 r /var/www/html/pireifej/northernstars/header-mobile.html
	 }' $file
       
       sudo sed -i '/{{about-me}}/{
    	 s/{{about-me}}//g
    	 r /var/www/html/pireifej/northernstars/about-me.html
	 }' $file

       sudo sed -i '/{{footer}}/{
    	 s/{{footer}}//g
    	 r /var/www/html/pireifej/northernstars/footer.html
	 }' $file
    fi
done

echo "Done"
