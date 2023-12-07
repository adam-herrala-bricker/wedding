#!/bin/bash

mkdir media &&
mkdir media/images &&
mkdir media/images/web-res &&

mkdir media/audio &&

# in production env, every web res image is already there
cp media_testing/images/_DSC0815.jpg media/images/web-res &&
cp media_testing/images/_DSC2591.jpg media/images/web-res &&
cp media_testing/images/_DSC2596.jpg media/images/web-res &&

cp media_testing/audio/down-the-aisle.mp3 media/audio &&

echo "Media folder built for backend testing!" &&

ls media -R