#!/bin/bash

cd /var/www/html
sudo rm -Rf *
sudo cp -Rf /home/pireifej/pireifej/* /var/www/html/

# prayer
for file in /var/www/html/prayer/*; do
    if [ ${file: -5} == ".html" ]
    then
       echo $file
       sudo sed -i '/{{header}}/{
    	 s/{{header}}//g
    	 r /var/www/html/prayer/header.html
	 }' $file
    fi
done

# pireifej
for file in /var/www/html/*; do
    if [ ${file: -5} == ".html" ]
    then
       echo $file
       sudo sed -i '/{{header}}/{
    	 s/{{header}}//g
    	 r /var/www/html/header.html
	 }' $file
    fi
done
