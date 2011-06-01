## TODO: Look into Advanced options.
## TODO: ADD closureLint
#Builds the whole app

#Delete and existing source files.
rm ./dist/build_prep.js
rm ./dist/app.js


# todo add options header to build_prep.js

# concat all js files.
cat ../js/*.js > ./dist/build_prep.js


#run build and output to app.js
java -jar compiler.jar --js ./dist/build_prep.js --js_output_file ./dist/app.js