#!/bin/bash

mkdir media &&
mkdir media/images &&
mkdir media/images/web-res &&

cp media_testing/images/_DSC0815.jpg media/images &&
cp media_testing/images/_DSC0815.jpg media/images/web-res &&

echo "Media folder built for backend testing!"