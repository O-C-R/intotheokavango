#!/bin/bash

/home/pi/okavango/gopro/./download_w2.sh &
/home/pi/okavango/gopro/./download_b1.sh &
/home/pi/okavango/gopro/./download_w1.sh &

wait
echo "3 cameras complete"
