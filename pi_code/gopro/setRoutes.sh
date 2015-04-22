# !/bin/bash

/etc/init.d/networking stop
/etc/init.d/networking start
service avahi-daemon restart

#cam 1 - w1

ip1="$(ifconfig wlan1 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}')"
ip route add 10.5.5.9 via ${ip1} dev wlan1
echo "Route to Cam 1 added"

#cam 2 - b2

ip2="$(ifconfig wlan2 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}')"
ip route add 10.5.5.9 via ${ip2} dev wlan2
echo "Route to Cam 2 added"

#cam 3 - b1

ip3="$(ifconfig wlan3 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}')"
ip route add 10.5.5.8 via ${ip3} dev wlan3
echo "Route to Cam 3 added"

