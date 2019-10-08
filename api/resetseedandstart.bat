@echo OFF

:choice
echo ABOUT TO DELETE DATABASE
set /P c=Are you sure you want to delete and re-seed the database[Y/N]?
if /I "%c%" EQU "Y" goto :reset
if /I "%c%" EQU "N" goto :quit
goto :choice

:reset
echo Deleting and re-seeding database, server will start when complete
rails db:drop:_unsafe && rails db:create && rails db:migrate && rails db:seed --trace && rails s



:quit
echo Stopping
