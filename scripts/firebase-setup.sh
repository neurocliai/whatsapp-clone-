#!/usr/bin/env bash
set -euo pipefail
echo "Opero Firebase setup"
echo "1) Install CLI: npm i -g firebase-tools"
echo "2) Login:      firebase login"
echo "3) Use project: firebase use opero-enterprise"
echo "4) Register web app in Console if missing, then paste keys into apps/*/.env.local"
echo "5) Deploy rules:  cd firebase && firebase deploy --only firestore:rules,database"
echo "RTDB URL: https://opero-enterprise-default-rtdb.firebaseio.com"
