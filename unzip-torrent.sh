#!/bin/bash
#
# Unzip torrent script 
# Set transmission settings.json parameters to
#    "script-torrent-done-enabled": true,
#    "script-torrent-done-filename": "/path/to/unzip-torrent.sh",
#
# Configure parameters below.
#
# Author: Marcos Almeida Jr. <junalmeida@gmail.com>
# Licensed under MIT License.

TR_USERNAME=
TR_PASSWORD=
TR_SERVER=localhost
TR_PORT=83

shopt -s nullglob

find "$TR_TORRENT_DIR" -type f|grep .rar$ |while read file
do
	echo ""
	echo "Extracting $file"
	unrar x "$file" "$TR_TORRENT_DIR" 2>> /var/tmp/unzip-torrent.log
	SUCCESS=$?
	if [ "$SUCCESS" -eq "0" ]; then
		echo "Cleaning..."
		sleep 10
		transmission-remote $TR_SERVER:$TR_PORT -n $TR_USERNAME:$TR_PASSWORD -t $TR_TORRENT_ID --remove-and-delete 2>> /var/tmp/unzip-torrent.log
		#rm -rf "$TR_TORRENT_DIR/Sample"
		#rm -f "$TR_TORRENT_DIR/*.txt"
		#rm -f "$TR_TORRENT_DIR/*.nfo"
		#rm -f "$TR_TORRENT_DIR/*.sfv"
		#rm -f "$TR_TORRENT_DIR/*.r*"
	else
		exit 
	fi 
 
done
echo "Job finished"
exit
