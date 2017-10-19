/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef __DELONGHI_H
#define __DELONGHI_H

#include "stm32f4xx_hal.h"

#define DL_PACKETSIZE 9 // each packet is 9 bytes in length

void DL_Init(SPI_HandleTypeDef *spi_handle);
void DL_Sync(void);
void DL_Start(void);
void DL_TransferCompletedCB(void);

#endif /* __DELONGHI_H */