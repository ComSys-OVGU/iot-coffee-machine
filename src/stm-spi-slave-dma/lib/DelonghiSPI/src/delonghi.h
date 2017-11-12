/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef __DELONGHI_H
#define __DELONGHI_H

#include "stm32f4xx_hal.h"

#define DL_PACKETSIZE 9 // each packet is 9 bytes in length
#define DL_PACKET_LCD_START 0xB0
#define DL_PACKET_PB_START 0x0B

#define DL_LCD_BTN_PWR 0x01
#define DL_LCD_BTN_P   0x04
#define DL_LCD_BTN_FLUSH_WATER 0x08
#define DL_LCD_BTN_HOT_WATER 0x10
#define DL_LCD_BTN_OK 0x20
#define DL_LCD_BTN_ONE_SMALL_COFFEE 0x40
#define DL_LCD_BTN_TWO_SMALL_COFFEES 0x80
#define DL_LCD_BTN_ONE_BIG_COFFEE 0x21

void DL_Init(SPI_HandleTypeDef * spi_handle_pb, SPI_HandleTypeDef * spi_handle_lcd);
void DL_Sync(void);
void DL_Start(void);
void DL_TransferCompletedCB(SPI_HandleTypeDef * spi_handle);

#endif /* __DELONGHI_H */