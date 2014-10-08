# sqrljs

a [Sails](http://sailsjs.org) application

SQRL magic is all mocked out currently. This is to demo what could be.

System Dependencies:
	Install 'npm' from your package manager

nodejs dependencies:
	npm -g install sails 
	npm install crypto qr-image sails-disk

To start go to the checkout directory and run:
	sails lift


This demo is in two parts:
	- highlight qr code/web sockets login where login is presented on one computer but negotiated on another (currently implemented)
	- highlight ease of login with strong authentication types using the above (not implemented, requires mobile app)

