//
// unzip-torrent.js
//
// This scripts extracts torrents with compressed files automatically.
// Configure uTorrent (or any other) to call this script 
// passing the torrent path and torrent status
// e.g: unzip-torrent.js "C:\path\to\torrentfolder" "finished"
// calling this script without parameters extracts all files from completedPath
//
// Important: JS files must be associated with Windows Script Host, or called explicitly.
//
// Author: Marcos Almeida Jr. <junalmeida@gmail.com>
// Licensed under MIT License


//set sevenZipPath to a full path 
var sevenZipPath="C:\\Program Files\\7-Zip\\7Z.exe";

//set completedPath to the path where torrent manager save finished torrents
var completedPath="D:\\Downloads\\Completed";


var wshell = new ActiveXObject("WScript.Shell")
var io = new ActiveXObject("Scripting.FileSystemObject");

function Execute(torrentPath) {
    var folder = io.GetFolder(torrentPath);

    var filesCollection = new Enumerator(folder.Files);
    for (filesCollection.moveFirst(); !filesCollection.atEnd(); filesCollection.moveNext()) {
        var file = filesCollection.item();
        var ext = io.GetExtensionName(file.Name);

        if (ext == "rar" ||
            ext == "zip" ||
            ext == "7z") {

            if (!Decompress(torrentPath, file.Path))
                return;
        }

    }
    CleanUp(torrentPath);
}

function Decompress(torrentPath, fileName) {
    var sevenZip = "\"" + sevenZipPath + "\"";
    sevenZip += " e -o\"" + torrentPath + "\" -y \"" + fileName + "\"";

    var ex = wshell.Run(sevenZip, 7, true);


    if (ex == 0)
        return true;
    else {
        WSH.Echo("An error ocurred while extracting " + fileName);
        return false;
    }
}

function CleanUp(torrentPath) {
    var folder = io.GetFolder(torrentPath);

    var filesCollection = new Enumerator(folder.Files);
    for (filesCollection.moveFirst(); !filesCollection.atEnd(); filesCollection.moveNext()) {
        var file = filesCollection.item();
        var ext = io.GetExtensionName(file.Name);

        if (ext.substr(0, 1) == "r" ||
            ext == "zip" ||
            ext == "7z" ||
            ext == "nfo" ||
            ext == "txt" ||
            ext == "srt" ||
            ext == "mta" ||
            ext == "sfv" ||
            ext == "srt"
            ) {

            file.Delete();
        }

    } 

    var sample = io.BuildPath(torrentPath, "Sample");
    if (io.FolderExists(sample))
        io.DeleteFolder(sample, true);

}

function Help()
{
    WSH.Echo(
        "unzip-utorrent:\r\n" +
        "unzip-utorrent.js \"x:\\path\\to\\torrent\" \"Status\"");
}


if (WSH.Arguments.length < 2)
{
    //look for all compressed files

    var folder = io.GetFolder(completedPath);

    var dirCollection = new Enumerator(folder.SubFolders);
    WSH.Echo("This will extract all zip/rar/7z files from " + completedPath + ". It will take a looong time.");
    for (dirCollection.moveFirst(); !dirCollection.atEnd(); dirCollection.moveNext()) {
        var file = dirCollection.item();
        Execute(file.Path);
    }

    WSH.Echo("The end!");
}
else
{
    var torrentPath = WSH.Arguments(0).toString().replace(/\"/ig, "");
    var status = WSH.Arguments(1).toString().replace(/\"/ig, "");
    if ((
	 status != "11" && 
	 status != "5" && 
	
	 status.toLowerCase() != "finalizado" && 
 	 status.toLowerCase() != "enviando" && 
 	 status.toLowerCase() != "finished" && 
 	 status.toLowerCase() != "sent" && 
 	 status.toLowerCase() != "completed"

	 ) || !io.FolderExists(torrentPath)) {

        WSH.Quit(0); //torrent is not completed, abort
    }

    Execute(torrentPath);
}