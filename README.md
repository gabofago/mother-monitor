# mother-monitor
nodejs monitor for chong's catalog. 

## running

``npm install`` will install dependencies

then

``node catalogue-mont.js`` will run the crawler on localhost:5000

## api end points
``get /active`` returns a json response of active threads

``get /archive`` returns a json response of archived threads. Archived threads are threads that disappeared from the catalog. So technically this also include deleted threads. also, the latest/most-freshly archived threads are on top, oldest on bottom

``get /new`` returns a json response of newly created threads. freshest threads on top.



