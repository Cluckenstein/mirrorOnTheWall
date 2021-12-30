#!/bin/sh
git add .
git commit -m "local commit for serverside"
git push
ssh -t admin@reihn.synology.me "sudo sh /volume1/repos/mirror/build_serverside.sh"