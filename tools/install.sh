#!/bin/sh

cd /var/www/html
sudo rm -Rf *
sudo cp -Rf /home/pireifej/pireifej/* /var/www/html/

# header replace for index
sudo sed -i '/{{header}}/{
    s/{{header}}//g
    r /var/www/html/prayer/header.html
}' /var/www/html/prayer/index.html

# header replace for request-feed.html
sudo sed -i '/{{header}}/{
    s/{{header}}//g
    r /var/www/html/prayer/header.html
}' /var/www/html/prayer/request-feed.html

# header replace for pray.html
sudo sed -i '/{{header}}/{
    s/{{header}}//g
    r /var/www/html/prayer/header.html
}' /var/www/html/prayer/pray.html

# header replace for profile.html
sudo sed -i '/{{header}}/{
    s/{{header}}//g
    r /var/www/html/prayer/header.html
}' /var/www/html/prayer/profile.html

# header replace for profile-edit.html
sudo sed -i '/{{header}}/{
    s/{{header}}//g
    r /var/www/html/prayer/header.html
}' /var/www/html/prayer/profile-edit.html

# header replace for new-request.html
sudo sed -i '/{{header}}/{
    s/{{header}}//g
    r /var/www/html/prayer/header.html
}' /var/www/html/prayer/new-request.html
