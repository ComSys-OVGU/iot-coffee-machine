/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef __DELONGHI_H
#define __DELONGHI_H

#include <stdint.h>
#include "stm32f4xx_hal.h"

// define LEDs with user-friendly names
#define LED_Green LED4 // LD4@PD12
#define LED_Orange LED3 // LD3@PD13
#define LED_Red LED5 // LD5@PD14
#define LED_Blue LED6 // LD6@PD15

// common
#define DL_PACKET_LCD_START 0xB0
#define DL_PACKET_PB_START 0x0B

// include only the one you need
#ifdef DELONGHI_PROTOCOL
#if DELONGHI_PROTOCOL == 1
#include "delonghi_v1.h"
#elif DELONGHI_PROTOCOL == 2
#include "delonghi_v2.h"
#endif
#endif
void DL_Set_Debug(int new_debug_enabled);
void DL_Init(SPI_HandleTypeDef * spi_handle_pb, SPI_HandleTypeDef * spi_handle_lcd);
void DL_Sync(void);
void DL_Start(void);
void DL_TransferCompletedCB(SPI_HandleTypeDef * spi_handle);
void DL_Test_Btn(void);

#endif /* __DELONGHI_H */
