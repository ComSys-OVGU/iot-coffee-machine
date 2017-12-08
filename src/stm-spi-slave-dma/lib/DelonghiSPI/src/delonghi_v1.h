/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef __DELONGHI_V1_H
#define __DELONGHI_V1_H

#define DL_PACKETSIZE 9 // each packet is 9 bytes in length
// #define DL_PACKETSIZE 11 // each packet is 11 bytes in length

#define DL_LCD_BTN_PWR                      0x01
#define DL_LCD_BTN_P                        0x04
#define DL_LCD_BTN_FLUSH_WATER              0x08
#define DL_LCD_BTN_HOT_WATER                0x10
#define DL_LCD_BTN_OK                       0x20
#define DL_LCD_BTN_ONE_SMALL_COFFEE         0x40
#define DL_LCD_BTN_TWO_SMALL_COFFEES        0x80
#define DL_LCD_BTN_ONE_BIG_COFFEE           0x21

#endif /* __DELONGHI_V1_H */
