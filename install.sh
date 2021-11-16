#!/bin/bash

echo "Install ..."
#cd /home/pireifej/pireifej/prayer
sudo cp -Rf /home/pireifej/pireifej/* /var/www/pireifej/
sudo chown -R www-data /var/www/pireifej

# prayer
#echo "prayer install ..."
#for file in /var/www/html/prayer/*; do
#    if [ ${file: -5} == ".html" ]
#    then
#	sudo sed -i '/{{header}}/{
#    	    s/{{header}}//g
#    	    r /var/www/html/prayer/header.html
#	    }' $file
#
#	sudo sed -i '/{{sidebar}}/{
#    	    s/{{sidebar}}//g
#    	    r /var/www/html/prayer/sidebar.html
#	    }' $file
#
#	sudo sed -i '/{{footer}}/{
 #   	    s/{{footer}}//g
  #  	    r /var/www/html/prayer/footer.html
#	    }' $file
#	    
#	    sudo sed -i '/{{ads}}/{         
#       	    s/{{ads}}//g         
#       	    r /var/www/html/prayer/ads.html
#       	    }' $file

#	    sudo sed -i '/{{ad}}/{
#	    s/{{ad}}//g
#	    r /var/www/html/prayer/ad.html
#	    }' $file

#	    sudo sed -i '/{{adcash}}/{
#	    s/{{adcash}}//g
#	    r /var/www/html/prayer/myadcash.html
#	    }' $file
#    fi
#done

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
