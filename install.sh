#!/bin/bash

echo "Install ..."

sudo cp -Rf /home/pireifej/pireifej/* /var/www/html/pireifej/
sudo chown -R www-data /var/www/html/pireifej

# pireifej
echo "pireifej install ..."
for file in /var/www/pireifej/*; do
    if [ ${file: -5} == ".html" ]
    then
       sudo sed -i '/{{header}}/{
    	 s/{{header}}//g
    	 r /var/www/pireifej/header.html
	 }' $file
       
       sudo sed -i '/{{footer}}/{
    	 s/{{footer}}//g
    	 r /var/www/pireifej/footer.html
	 }' $file

       sudo sed -i '/{{toastmastersBio}}/{
    	 s/{{toastmastersBio}}//g
    	 r /var/www/pireifej/toastmastersBio.html
	 }' $file
    fi
done

echo "Done"
