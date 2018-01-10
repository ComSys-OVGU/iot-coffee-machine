EESchema Schematic File Version 2
LIBS:Coffee-rescue
LIBS:power
LIBS:device
LIBS:switches
LIBS:relays
LIBS:motors
LIBS:transistors
LIBS:conn
LIBS:linear
LIBS:regul
LIBS:74xx
LIBS:cmos4000
LIBS:adc-dac
LIBS:memory
LIBS:xilinx
LIBS:microcontrollers
LIBS:dsp
LIBS:microchip
LIBS:analog_switches
LIBS:motorola
LIBS:texas
LIBS:intel
LIBS:audio
LIBS:interface
LIBS:digital-audio
LIBS:philips
LIBS:display
LIBS:cypress
LIBS:siliconi
LIBS:opto
LIBS:atmel
LIBS:contrib
LIBS:valves
LIBS:analog_devices
LIBS:stm32
LIBS:Coffee-cache
EELAYER 25 0
EELAYER END
$Descr A3 16535 11693
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L STM32F407VGTx U1
U 1 1 5A1DE778
P 5750 3700
F 0 "U1" H 1450 6525 50  0000 L BNN
F 1 "STM32F407VGTx" H 10050 6525 50  0000 R BNN
F 2 "LQFP100" H 10050 6475 50  0001 R TNN
F 3 "" H 5750 3700 50  0001 C CNN
	1    5750 3700
	1    0    0    -1  
$EndComp
$Comp
L +3.3V #PWR01
U 1 1 5A1F02BA
P 6300 600
F 0 "#PWR01" H 6300 450 50  0001 C CNN
F 1 "+3.3V" H 6300 740 50  0000 C CNN
F 2 "" H 6300 600 50  0001 C CNN
F 3 "" H 6300 600 50  0001 C CNN
	1    6300 600 
	0    1    1    0   
$EndComp
$Comp
L Earth #PWR02
U 1 1 5A1F02DE
P 6100 6700
F 0 "#PWR02" H 6100 6450 50  0001 C CNN
F 1 "Earth" H 6100 6550 50  0001 C CNN
F 2 "" H 6100 6700 50  0001 C CNN
F 3 "" H 6100 6700 50  0001 C CNN
	1    6100 6700
	1    0    0    -1  
$EndComp
$Comp
L ISO7341FC U2
U 1 1 5A2DA989
P 6350 9400
F 0 "U2" H 6350 10025 50  0000 C CNN
F 1 "ISO7341FC" H 6350 9950 50  0000 C CNN
F 2 "Housings_SOIC:SOIC-16W_7.5x10.3mm_Pitch1.27mm" H 6350 8850 50  0001 C CIN
F 3 "" H 6350 9800 50  0001 C CNN
	1    6350 9400
	1    0    0    -1  
$EndComp
$Comp
L C_Small C1
U 1 1 5A2DBFD0
P 5450 9200
F 0 "C1" H 5460 9270 50  0000 L CNN
F 1 "0.1µ" H 5460 9120 50  0000 L CNN
F 2 "" H 5450 9200 50  0001 C CNN
F 3 "" H 5450 9200 50  0001 C CNN
	1    5450 9200
	1    0    0    -1  
$EndComp
Text Label 5650 9800 0    39   ~ 0
SPI1_MISO
Text Label 5650 9600 0    39   ~ 0
SPI1_SCK
Text Label 5650 9500 0    39   ~ 0
SPI1_MOSI
$Comp
L GND #PWR03
U 1 1 5A2DD255
P 7400 9100
F 0 "#PWR03" H 7400 8850 50  0001 C CNN
F 1 "GND" H 7400 8950 50  0000 C CNN
F 2 "" H 7400 9100 50  0001 C CNN
F 3 "" H 7400 9100 50  0001 C CNN
	1    7400 9100
	1    0    0    -1  
$EndComp
Text Label 1000 1200 0    39   ~ 0
NRST
$Comp
L AVR-JTAG-10 CON1
U 1 1 5A316DE1
P 13550 3900
F 0 "CON1" H 13380 4230 50  0000 C CNN
F 1 "AVR-JTAG-10" H 13210 3570 50  0000 L BNN
F 2 "AVR-JTAG-10" V 12980 3920 50  0001 C CNN
F 3 "" H 13550 3900 50  0001 C CNN
	1    13550 3900
	1    0    0    -1  
$EndComp
Text Label 10250 3300 0    39   ~ 0
SPI1_MISO
Text Label 10650 3200 0    39   ~ 0
SPI1_SCK
Text Label 10250 3400 0    39   ~ 0
SPI1_MOSI
Text Label 12900 3700 0    60   ~ 0
3.3v
Text Label 12950 3800 0    60   ~ 0
GND
$Comp
L GND #PWR04
U 1 1 5A3969EE
P 12550 3750
F 0 "#PWR04" H 12550 3500 50  0001 C CNN
F 1 "GND" H 12550 3600 50  0000 C CNN
F 2 "" H 12550 3750 50  0001 C CNN
F 3 "" H 12550 3750 50  0001 C CNN
	1    12550 3750
	-1   0    0    1   
$EndComp
Text Label 12950 3900 0    60   ~ 0
GND
Text Label 12950 4100 0    60   ~ 0
GND
Text Label 13050 4000 0    60   ~ 0
NC
Text Label 14000 3700 0    60   ~ 0
SWDIO
Text Label 14000 3800 0    60   ~ 0
SWDCLK
Text Label 14000 3900 0    60   ~ 0
SWDO
Text Label 14000 4100 0    60   ~ 0
NRST
$Comp
L R R1
U 1 1 5A397B72
P 850 1250
F 0 "R1" V 930 1250 50  0000 C CNN
F 1 "10K" V 850 1250 50  0000 C CNN
F 2 "" V 780 1250 50  0000 C CNN
F 3 "" H 850 1250 50  0000 C CNN
	1    850  1250
	1    0    0    -1  
$EndComp
$Comp
L R R2
U 1 1 5A397C21
P 650 1500
F 0 "R2" V 730 1500 50  0000 C CNN
F 1 "10K" V 650 1500 50  0000 C CNN
F 2 "" V 580 1500 50  0000 C CNN
F 3 "" H 650 1500 50  0000 C CNN
	1    650  1500
	0    1    1    0   
$EndComp
$Comp
L +3.3V #PWR05
U 1 1 5A397EFD
P 600 1300
F 0 "#PWR05" H 600 1150 50  0001 C CNN
F 1 "+3.3V" H 600 1440 50  0000 C CNN
F 2 "" H 600 1300 50  0001 C CNN
F 3 "" H 600 1300 50  0001 C CNN
	1    600  1300
	1    0    0    -1  
$EndComp
$Comp
L R R4
U 1 1 5A3981FC
P 11100 3100
F 0 "R4" V 11180 3100 50  0000 C CNN
F 1 "10K" V 11100 3100 50  0000 C CNN
F 2 "" V 11030 3100 50  0000 C CNN
F 3 "" H 11100 3100 50  0000 C CNN
	1    11100 3100
	0    1    1    0   
$EndComp
$Comp
L R R3
U 1 1 5A39841E
P 10800 2900
F 0 "R3" V 10880 2900 50  0000 C CNN
F 1 "10K" V 10800 2900 50  0000 C CNN
F 2 "" V 10730 2900 50  0000 C CNN
F 3 "" H 10800 2900 50  0000 C CNN
	1    10800 2900
	-1   0    0    1   
$EndComp
$Comp
L +3.3V #PWR06
U 1 1 5A3985F9
P 11250 3100
F 0 "#PWR06" H 11250 2950 50  0001 C CNN
F 1 "+3.3V" H 11250 3240 50  0000 C CNN
F 2 "" H 11250 3100 50  0001 C CNN
F 3 "" H 11250 3100 50  0001 C CNN
	1    11250 3100
	0    1    1    0   
$EndComp
$Comp
L Earth #PWR07
U 1 1 5A398832
P 850 1000
F 0 "#PWR07" H 850 750 50  0001 C CNN
F 1 "Earth" H 850 850 50  0001 C CNN
F 2 "" H 850 1000 50  0001 C CNN
F 3 "" H 850 1000 50  0001 C CNN
	1    850  1000
	-1   0    0    1   
$EndComp
$Comp
L Earth #PWR08
U 1 1 5A3989F6
P 10800 2750
F 0 "#PWR08" H 10800 2500 50  0001 C CNN
F 1 "Earth" H 10800 2600 50  0001 C CNN
F 2 "" H 10800 2750 50  0001 C CNN
F 3 "" H 10800 2750 50  0001 C CNN
	1    10800 2750
	-1   0    0    1   
$EndComp
Text Label 10650 2500 0    60   ~ 0
SWDIO
Text Label 10650 2600 0    60   ~ 0
SWDCLK
Text Label 10500 3700 0    60   ~ 0
SWDO
$Comp
L +3.3V #PWR010
U 1 1 5A39C4BB
P 13200 1050
F 0 "#PWR010" H 13200 900 50  0001 C CNN
F 1 "+3.3V" H 13200 1190 50  0000 C CNN
F 2 "" H 13200 1050 50  0001 C CNN
F 3 "" H 13200 1050 50  0001 C CNN
	1    13200 1050
	0    -1   -1   0   
$EndComp
$Comp
L MCP1754ST-1802E/MB U3
U 1 1 5A39CFF9
P 13300 2050
F 0 "U3" H 13400 1900 50  0000 C CNN
F 1 "MCP1700T-3002E/TT" H 13300 2200 50  0000 C CNN
F 2 "" H 13300 2050 50  0000 C CNN
F 3 "" H 13300 2050 50  0000 C CNN
	1    13300 2050
	1    0    0    -1  
$EndComp
Text Label 13800 2050 0    60   ~ 0
5V
$Comp
L +3.3V #PWR011
U 1 1 5A394B7E
P 12750 2050
F 0 "#PWR011" H 12750 1900 50  0001 C CNN
F 1 "+3.3V" H 12750 2190 50  0000 C CNN
F 2 "" H 12750 2050 50  0001 C CNN
F 3 "" H 12750 2050 50  0001 C CNN
	1    12750 2050
	1    0    0    -1  
$EndComp
$Comp
L C C3
U 1 1 5A394F05
P 12950 2350
F 0 "C3" H 12975 2450 50  0000 L CNN
F 1 "1µ" H 12975 2250 50  0000 L CNN
F 2 "" H 12988 2200 50  0000 C CNN
F 3 "" H 12950 2350 50  0000 C CNN
	1    12950 2350
	1    0    0    -1  
$EndComp
$Comp
L C C4
U 1 1 5A394F80
P 13700 2350
F 0 "C4" H 13725 2450 50  0000 L CNN
F 1 "1µ" H 13725 2250 50  0000 L CNN
F 2 "" H 13738 2200 50  0000 C CNN
F 3 "" H 13700 2350 50  0000 C CNN
	1    13700 2350
	1    0    0    -1  
$EndComp
$Comp
L Earth #PWR012
U 1 1 5A395309
P 13300 2500
F 0 "#PWR012" H 13300 2250 50  0001 C CNN
F 1 "Earth" H 13300 2350 50  0001 C CNN
F 2 "" H 13300 2500 50  0001 C CNN
F 3 "" H 13300 2500 50  0001 C CNN
	1    13300 2500
	1    0    0    -1  
$EndComp
$Comp
L Earth #PWR013
U 1 1 5A39722F
P 5450 9300
F 0 "#PWR013" H 5450 9050 50  0001 C CNN
F 1 "Earth" H 5450 9150 50  0001 C CNN
F 2 "" H 5450 9300 50  0001 C CNN
F 3 "" H 5450 9300 50  0001 C CNN
	1    5450 9300
	1    0    0    -1  
$EndComp
$Comp
L +3.3V #PWR014
U 1 1 5A3981C5
P 5450 8750
F 0 "#PWR014" H 5450 8600 50  0001 C CNN
F 1 "+3.3V" H 5450 8890 50  0000 C CNN
F 2 "" H 5450 8750 50  0001 C CNN
F 3 "" H 5450 8750 50  0001 C CNN
	1    5450 8750
	1    0    0    -1  
$EndComp
$Comp
L C_Small C2
U 1 1 5A398AD5
P 7400 9000
F 0 "C2" H 7410 9070 50  0000 L CNN
F 1 "0.1µ" H 7410 8920 50  0000 L CNN
F 2 "" H 7400 9000 50  0001 C CNN
F 3 "" H 7400 9000 50  0001 C CNN
	1    7400 9000
	1    0    0    -1  
$EndComp
Text Label 7400 8750 0    60   ~ 0
5.0V
$Comp
L Earth #PWR015
U 1 1 5A399EC5
P 5850 9150
F 0 "#PWR015" H 5850 8900 50  0001 C CNN
F 1 "Earth" H 5850 9000 50  0001 C CNN
F 2 "" H 5850 9150 50  0001 C CNN
F 3 "" H 5850 9150 50  0001 C CNN
	1    5850 9150
	0    1    1    0   
$EndComp
$Comp
L GND #PWR016
U 1 1 5A39A197
P 6950 9150
F 0 "#PWR016" H 6950 8900 50  0001 C CNN
F 1 "GND" H 6950 9000 50  0000 C CNN
F 2 "" H 6950 9150 50  0001 C CNN
F 3 "" H 6950 9150 50  0001 C CNN
	1    6950 9150
	0    -1   -1   0   
$EndComp
Text Label 7100 9800 0    39   ~ 0
PB_MISO
Text Label 7100 9500 0    39   ~ 0
PB_MOSI
Text Label 7100 9600 0    39   ~ 0
PB_SCK
Text Label 7000 9700 0    39   ~ 0
NOCONN
Text Label 10250 3900 0    39   ~ 0
SPI2_SCK
Text Label 10250 4400 0    39   ~ 0
SPI2_MOSI
Text Label 10250 4300 0    39   ~ 0
SPI2_MISO
Text Label 10250 5600 0    39   ~ 0
SPI3_SCK
Text Label 10250 5700 0    39   ~ 0
SPI3_MISO
Text Label 10250 5800 0    39   ~ 0
SPI3_MOSI
$Comp
L ISO7341FC U1
U 1 1 5A513919
P 3000 9400
F 0 "U1" H 3000 10025 50  0000 C CNN
F 1 "ISO7341FC" H 3000 9950 50  0000 C CNN
F 2 "Housings_SOIC:SOIC-16W_7.5x10.3mm_Pitch1.27mm" H 3000 8850 50  0001 C CIN
F 3 "" H 3000 9800 50  0001 C CNN
	1    3000 9400
	1    0    0    -1  
$EndComp
$Comp
L C_Small C?
U 1 1 5A51391F
P 2100 9200
F 0 "C?" H 2110 9270 50  0000 L CNN
F 1 "0.1µ" H 2110 9120 50  0000 L CNN
F 2 "" H 2100 9200 50  0001 C CNN
F 3 "" H 2100 9200 50  0001 C CNN
	1    2100 9200
	1    0    0    -1  
$EndComp
Text Label 2300 9800 0    39   ~ 0
SPI2_MISO
Text Label 2300 9600 0    39   ~ 0
SPI2_SCK
Text Label 2300 9500 0    39   ~ 0
SPI2_MOSI
$Comp
L GND #PWR?
U 1 1 5A513928
P 4050 9100
F 0 "#PWR?" H 4050 8850 50  0001 C CNN
F 1 "GND" H 4050 8950 50  0000 C CNN
F 2 "" H 4050 9100 50  0001 C CNN
F 3 "" H 4050 9100 50  0001 C CNN
	1    4050 9100
	1    0    0    -1  
$EndComp
$Comp
L Earth #PWR?
U 1 1 5A51392E
P 2100 9300
F 0 "#PWR?" H 2100 9050 50  0001 C CNN
F 1 "Earth" H 2100 9150 50  0001 C CNN
F 2 "" H 2100 9300 50  0001 C CNN
F 3 "" H 2100 9300 50  0001 C CNN
	1    2100 9300
	1    0    0    -1  
$EndComp
$Comp
L +3.3V #PWR?
U 1 1 5A513934
P 2100 8750
F 0 "#PWR?" H 2100 8600 50  0001 C CNN
F 1 "+3.3V" H 2100 8890 50  0000 C CNN
F 2 "" H 2100 8750 50  0001 C CNN
F 3 "" H 2100 8750 50  0001 C CNN
	1    2100 8750
	1    0    0    -1  
$EndComp
$Comp
L C_Small C?
U 1 1 5A51393A
P 4050 9000
F 0 "C?" H 4060 9070 50  0000 L CNN
F 1 "0.1µ" H 4060 8920 50  0000 L CNN
F 2 "" H 4050 9000 50  0001 C CNN
F 3 "" H 4050 9000 50  0001 C CNN
	1    4050 9000
	1    0    0    -1  
$EndComp
Text Label 4050 8750 0    60   ~ 0
5V
$Comp
L Earth #PWR?
U 1 1 5A513941
P 2500 9150
F 0 "#PWR?" H 2500 8900 50  0001 C CNN
F 1 "Earth" H 2500 9000 50  0001 C CNN
F 2 "" H 2500 9150 50  0001 C CNN
F 3 "" H 2500 9150 50  0001 C CNN
	1    2500 9150
	0    1    1    0   
$EndComp
$Comp
L GND #PWR?
U 1 1 5A513947
P 3600 9150
F 0 "#PWR?" H 3600 8900 50  0001 C CNN
F 1 "GND" H 3600 9000 50  0000 C CNN
F 2 "" H 3600 9150 50  0001 C CNN
F 3 "" H 3600 9150 50  0001 C CNN
	1    3600 9150
	0    -1   -1   0   
$EndComp
Text Label 3750 9800 0    39   ~ 0
LCD_MISO
Text Label 3750 9500 0    39   ~ 0
LCD_MOSI
Text Label 3750 9600 0    39   ~ 0
LCD_SCK
Text Label 3650 9700 0    39   ~ 0
NOCONN
Text Label 5700 9700 0    39   ~ 0
NOCONN
Wire Wire Line
	5450 600  5550 600 
Wire Wire Line
	5550 600  5650 600 
Wire Wire Line
	5650 600  5750 600 
Wire Wire Line
	5750 600  5850 600 
Wire Wire Line
	5850 600  5950 600 
Wire Wire Line
	5950 600  6050 600 
Wire Wire Line
	6050 600  6300 600 
Wire Wire Line
	5450 700  5450 600 
Wire Wire Line
	5550 700  5550 600 
Connection ~ 5550 600 
Wire Wire Line
	5650 700  5650 600 
Connection ~ 5650 600 
Wire Wire Line
	5750 700  5750 600 
Connection ~ 5750 600 
Wire Wire Line
	5850 700  5850 600 
Connection ~ 5850 600 
Wire Wire Line
	5950 700  5950 600 
Connection ~ 5950 600 
Wire Wire Line
	6050 700  6050 600 
Connection ~ 6050 600 
Wire Wire Line
	5550 6700 5650 6700
Wire Wire Line
	5650 6700 5750 6700
Wire Wire Line
	5750 6700 5850 6700
Wire Wire Line
	5850 6700 5950 6700
Wire Wire Line
	5950 6700 6100 6700
Wire Wire Line
	5550 6700 5550 6600
Wire Wire Line
	5650 6600 5650 6700
Connection ~ 5650 6700
Wire Wire Line
	5750 6600 5750 6700
Connection ~ 5750 6700
Wire Wire Line
	5850 6600 5850 6700
Connection ~ 5850 6700
Wire Wire Line
	5950 6600 5950 6700
Connection ~ 5950 6700
Wire Wire Line
	5950 8950 5950 9000
Wire Wire Line
	5450 8950 5650 8950
Wire Wire Line
	5650 8950 5950 8950
Wire Wire Line
	5650 9300 5950 9300
Wire Wire Line
	6750 9000 6800 9000
Wire Wire Line
	6800 9000 6800 8900
Wire Wire Line
	6800 8900 7200 8900
Wire Wire Line
	7200 8900 7400 8900
Wire Wire Line
	5650 9500 5950 9500
Wire Wire Line
	5650 9600 5950 9600
Wire Wire Line
	6750 9800 7100 9800
Wire Wire Line
	6750 9500 7100 9500
Wire Wire Line
	6750 9600 7100 9600
Wire Wire Line
	5650 9800 5950 9800
Wire Wire Line
	10250 2600 10650 2600
Wire Wire Line
	10250 2500 10650 2500
Wire Wire Line
	1250 1200 1000 1200
Wire Wire Line
	10250 2700 10650 2700
Wire Wire Line
	10250 3200 10650 3200
Wire Wire Line
	13350 3700 12900 3700
Wire Wire Line
	13350 3800 12900 3800
Wire Wire Line
	12550 3900 12900 3900
Wire Wire Line
	12900 3900 13350 3900
Wire Wire Line
	12900 4100 13350 4100
Wire Wire Line
	13600 3700 14000 3700
Wire Wire Line
	13600 3800 14000 3800
Wire Wire Line
	13600 3900 14000 3900
Wire Wire Line
	13600 4000 14000 4000
Wire Wire Line
	13600 4100 14000 4100
Wire Wire Line
	12900 3800 12900 3900
Wire Wire Line
	12900 3900 12900 4100
Connection ~ 12900 3900
Wire Wire Line
	12550 3900 12550 3750
Wire Wire Line
	13350 4000 13050 4000
Wire Wire Line
	1250 1400 850  1400
Wire Wire Line
	850  1100 850  1000
Wire Wire Line
	850  1400 850  1500
Wire Wire Line
	850  1500 800  1500
Wire Wire Line
	10250 3100 10800 3100
Wire Wire Line
	10800 3100 10950 3100
Wire Wire Line
	10800 3050 10800 3100
Connection ~ 10800 3100
Wire Wire Line
	10250 3700 10500 3700
Wire Wire Line
	500  1300 500  1500
Wire Wire Line
	500  1300 600  1300
Wire Wire Line
	13600 2050 13700 2050
Wire Wire Line
	13700 2050 13800 2050
Wire Wire Line
	12750 2050 12950 2050
Wire Wire Line
	12950 2050 13000 2050
Wire Wire Line
	12950 2050 12950 2200
Connection ~ 12950 2050
Wire Wire Line
	12950 2500 13300 2500
Wire Wire Line
	13300 2500 13700 2500
Wire Wire Line
	13700 2200 13700 2050
Connection ~ 13700 2050
Wire Wire Line
	13300 2250 13300 2500
Connection ~ 13300 2500
Wire Wire Line
	5450 8750 5450 8950
Wire Wire Line
	5450 8950 5450 9100
Connection ~ 5450 8950
Wire Wire Line
	7400 8900 7400 8750
Wire Wire Line
	5950 9100 5950 9150
Wire Wire Line
	5950 9150 5950 9200
Wire Wire Line
	5650 9300 5650 8950
Connection ~ 5650 8950
Wire Wire Line
	5950 9150 5850 9150
Connection ~ 5950 9150
Wire Wire Line
	6750 9100 6750 9150
Wire Wire Line
	6750 9150 6750 9200
Wire Wire Line
	6750 9300 7200 9300
Wire Wire Line
	7200 9300 7200 8900
Connection ~ 7200 8900
Wire Wire Line
	6750 9150 6950 9150
Connection ~ 6750 9150
Wire Wire Line
	6750 9700 7000 9700
Wire Wire Line
	2600 8950 2600 9000
Wire Wire Line
	2100 8950 2300 8950
Wire Wire Line
	2300 8950 2600 8950
Wire Wire Line
	2300 9300 2600 9300
Wire Wire Line
	3400 9000 3450 9000
Wire Wire Line
	3450 9000 3450 8900
Wire Wire Line
	3450 8900 3850 8900
Wire Wire Line
	3850 8900 4050 8900
Wire Wire Line
	2300 9500 2600 9500
Wire Wire Line
	2300 9600 2600 9600
Wire Wire Line
	3400 9800 3750 9800
Wire Wire Line
	3400 9500 3750 9500
Wire Wire Line
	3400 9600 3750 9600
Wire Wire Line
	2300 9800 2600 9800
Wire Wire Line
	2100 8750 2100 8950
Wire Wire Line
	2100 8950 2100 9100
Connection ~ 2100 8950
Wire Wire Line
	4050 8900 4050 8750
Wire Wire Line
	2600 9100 2600 9150
Wire Wire Line
	2600 9150 2600 9200
Wire Wire Line
	2300 9300 2300 8950
Connection ~ 2300 8950
Wire Wire Line
	2600 9150 2500 9150
Connection ~ 2600 9150
Wire Wire Line
	3400 9100 3400 9150
Wire Wire Line
	3400 9150 3400 9200
Wire Wire Line
	3400 9300 3850 9300
Wire Wire Line
	3850 9300 3850 8900
Connection ~ 3850 8900
Wire Wire Line
	3400 9150 3600 9150
Connection ~ 3400 9150
Wire Wire Line
	3400 9700 3650 9700
Text Label 2350 9700 0    39   ~ 0
NOCONN
Wire Wire Line
	2600 9700 2350 9700
$Comp
L Conn_01x05 P3
U 1 1 5A516043
P 13700 5050
F 0 "P3" H 13700 5350 50  0000 C CNN
F 1 "Conn_01x05" H 13700 4750 50  0000 C CNN
F 2 "" H 13700 5050 50  0001 C CNN
F 3 "" H 13700 5050 50  0001 C CNN
	1    13700 5050
	1    0    0    -1  
$EndComp
Wire Wire Line
	13500 4850 13300 4850
Wire Wire Line
	13500 4950 13300 4950
Wire Wire Line
	13500 5050 13300 5050
Wire Wire Line
	13500 5150 13300 5150
Wire Wire Line
	13500 5250 13300 5250
Text Label 12950 4950 0    39   ~ 0
SPI3_MISO
Text Label 12950 4850 0    39   ~ 0
SPI3_SCK
Text Label 12950 5050 0    39   ~ 0
SPI3_MOSI
Text Label 13150 5150 0    39   ~ 0
5V
$Comp
L Earth #PWR?
U 1 1 5A51673B
P 13300 5250
F 0 "#PWR?" H 13300 5000 50  0001 C CNN
F 1 "Earth" H 13300 5100 50  0001 C CNN
F 2 "" H 13300 5250 50  0001 C CNN
F 3 "" H 13300 5250 50  0001 C CNN
	1    13300 5250
	0    1    1    0   
$EndComp
Text Label 13050 5250 0    39   ~ 0
GND
$Comp
L Conn_02x05_Odd_Even P1
U 1 1 5A5182E9
P 13450 6750
F 0 "P1" H 13500 7050 50  0000 C CNN
F 1 "Conn_02x05_Odd_Even" H 13500 6450 50  0000 C CNN
F 2 "" H 13450 6750 50  0001 C CNN
F 3 "" H 13450 6750 50  0001 C CNN
	1    13450 6750
	1    0    0    -1  
$EndComp
Wire Wire Line
	13250 6550 13100 6550
Wire Wire Line
	13250 6650 13100 6650
Wire Wire Line
	13250 6750 13100 6750
Wire Wire Line
	13250 6850 13100 6850
Wire Wire Line
	13250 6950 13100 6950
Wire Wire Line
	13750 6950 13900 6950
Wire Wire Line
	13750 6850 13900 6850
Wire Wire Line
	13750 6750 13900 6750
Wire Wire Line
	13750 6650 13900 6650
Wire Wire Line
	13750 6550 13900 6550
$Comp
L GND #PWR?
U 1 1 5A518A18
P 13100 6550
F 0 "#PWR?" H 13100 6300 50  0001 C CNN
F 1 "GND" H 13100 6400 50  0000 C CNN
F 2 "" H 13100 6550 50  0001 C CNN
F 3 "" H 13100 6550 50  0001 C CNN
	1    13100 6550
	0    1    1    0   
$EndComp
Text Label 13100 6650 0    39   ~ 0
5.0V
Text Label 12850 6750 0    39   ~ 0
PB_MISO
Text Label 12850 6850 0    39   ~ 0
PB_MOSI
Text Label 12850 6950 0    39   ~ 0
PB_SCK
Text Label 13900 6750 0    39   ~ 0
LCD_MOSI
Text Label 13900 6850 0    39   ~ 0
LCD_SCK
Text Label 13900 6950 0    39   ~ 0
LCD_MISO
Text Label 13800 6650 0    60   ~ 0
5V
$Comp
L GND #PWR?
U 1 1 5A5199D0
P 13900 6550
F 0 "#PWR?" H 13900 6300 50  0001 C CNN
F 1 "GND" H 13900 6400 50  0000 C CNN
F 2 "" H 13900 6550 50  0001 C CNN
F 3 "" H 13900 6550 50  0001 C CNN
	1    13900 6550
	0    -1   -1   0   
$EndComp
$Comp
L Conn_01x02 P2
U 1 1 5A51B1D0
P 13400 1050
F 0 "P2" H 13400 1150 50  0000 C CNN
F 1 "Conn_01x02" H 13400 850 50  0000 C CNN
F 2 "" H 13400 1050 50  0001 C CNN
F 3 "" H 13400 1050 50  0001 C CNN
	1    13400 1050
	1    0    0    -1  
$EndComp
$Comp
L Earth #PWR?
U 1 1 5A51B332
P 13200 1150
F 0 "#PWR?" H 13200 900 50  0001 C CNN
F 1 "Earth" H 13200 1000 50  0001 C CNN
F 2 "" H 13200 1150 50  0001 C CNN
F 3 "" H 13200 1150 50  0001 C CNN
	1    13200 1150
	0    1    1    0   
$EndComp
$EndSCHEMATC
