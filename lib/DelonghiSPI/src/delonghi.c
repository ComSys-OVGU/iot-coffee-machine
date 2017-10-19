#include "delonghi.h"
#include "../../STM32F4-Discovery/src/stm32f4_discovery.h"

extern void _Error_Handler(char *, int);
#define Error_Handler() _Error_Handler(__FILE__, __LINE__)

/* Buffer used for transmission */
// uint8_t aTxBuffer[] = {0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00};
uint8_t aTxBuffer[] = {0x0B, 0x07, 0x00, 0x28, 0x0F, 0x20, 0x04, 0x00, 0xC2};

/* Buffer used for reception */
uint8_t aRxBuffer[DL_PACKETSIZE];

int state = -1;

SPI_HandleTypeDef *DL_SPI_Handle;
void DL_Init(SPI_HandleTypeDef *spi_handle) {
    DL_SPI_Handle = spi_handle;

    printf("[Delonghi] Init'd\n");
}

void DL_Sync(void) {
    state = 0; // starting to sync
    // first, sync to the 0xB0 Byte
  while (1) {
    // wait for one byte
    if(HAL_SPI_TransmitReceive_DMA(DL_SPI_Handle, (uint8_t*)aTxBuffer, (uint8_t *)aRxBuffer, 1) != HAL_OK)
    {
      /* Transfer error in transmission process */
      Error_Handler();
    }
    while (HAL_SPI_GetState(DL_SPI_Handle) != HAL_SPI_STATE_READY)
    {
    }

    if(aRxBuffer[0] == 0xB0) {
      BSP_LED_Toggle(LED3);
      // we found it, great!
      
      // wait for 8 other bytes, then exit
      // wait for one byte
      if(HAL_SPI_TransmitReceive_DMA(DL_SPI_Handle, (uint8_t*)aTxBuffer, (uint8_t *)aRxBuffer, 8) != HAL_OK)
      {
        /* Transfer error in transmission process */
        Error_Handler();
      }
      while (HAL_SPI_GetState(DL_SPI_Handle) != HAL_SPI_STATE_READY)
      {
      }
      
      BSP_LED_Toggle(LED3);
      break;
    } else {
      // toggle blue led to indicate waiting status
      BSP_LED_Toggle(LED6);
    }
  }
  BSP_LED_Off(LED6);
  BSP_LED_Off(LED3);
  state = 1; // synced

  printf("[Delonghi] Sync'd\n");
}

static uint8_t checksum(uint8_t* packet) {
    int sum = 0x55; // this is the start value delonghi uses
    
    int i = 0;
    for(; i < 8; i++) {
        sum = (sum + packet[i]) % 256;
    }
    return sum;
}

static int checksumOK(uint8_t* packet) {
    return checksum(packet) == packet[8];
}

void DL_Start(void) {
      /*##-2- Start the Full Duplex Communication process ########################*/  
  /* While the SPI in TransmitReceive process, user can transmit data through 
     "aTxBuffer" buffer & receive data through "aRxBuffer" */
     
while (1) {
    BSP_LED_Toggle(LED4);

    if(HAL_SPI_TransmitReceive_DMA(DL_SPI_Handle, (uint8_t*)aTxBuffer, (uint8_t *)aRxBuffer, DL_PACKETSIZE) != HAL_OK)
    {
      /* Transfer error in transmission process */
      Error_Handler();
    }
  
    /*##-3- Wait for the end of the transfer ###################################*/  
    /*  Before starting a new communication transfer, you need to check the current   
        state of the peripheral; if it�s busy you need to wait for the end of current
        transfer before starting a new one.
        For simplicity reasons, this example is just waiting till the end of the 
        transfer, but application may perform other tasks while transfer operation
        is ongoing. */  
    while (HAL_SPI_GetState(DL_SPI_Handle) != HAL_SPI_STATE_READY)
    {
    }

    if(state == 1) {
        state = 2; // first packet sent and received
    }
  }
}

int lastBtn = 0;
void DL_TransferCompletedCB(void) {
    // not synced yet, exit
    if(state < 2) {
        return;
    }
    if(!checksumOK(aRxBuffer)) {
        Error_Handler();
    }

    int update = 0;
    uint8_t btn = aRxBuffer[1];
    if(btn == 0x01) {
        // PWR BTN

        int i;
        for(i = 1; i < DL_PACKETSIZE - 1; i++) {
            aTxBuffer[i] = 0x00;
        }

        update = 1;
    } else if(lastBtn != 0 && (btn == 0x04 || btn == 0x08 || btn == 0x10 || btn == 0x20 || btn == 0x40 || btn == 0x80 || aRxBuffer[2] == 0x21)) {
        // repeated press, ignore
        if(lastBtn++ >= 10) {
            lastBtn = 0;
        }
    } else if(btn == 0x04) {
        // P btn
        aTxBuffer[1] = (aTxBuffer[1] + 0x01) & 0xFF;
        
        update = 1;
    
    } else if(btn == 0x08) {
        // flush_water btn
        aTxBuffer[2] = (aTxBuffer[2] + 0x01) & 0xFF;
        
        update = 1;
    
    } else if(btn == 0x10) {
        // hot_water btn
        aTxBuffer[3] = (aTxBuffer[3] + 0x01) & 0xFF;
        
        update = 1;
    
    } else if(btn == 0x20) {
        // OK btn
        aTxBuffer[4] = (aTxBuffer[4] + 0x01) & 0xFF;
        
        update = 1;
    } else if(btn == 0x40) {
        // one cup small
        aTxBuffer[5] = (aTxBuffer[5] + 0x01) & 0xFF;
        
        update = 1;
    } else if(btn == 0x80) {
        // two cups small
        aTxBuffer[6] = (aTxBuffer[6] + 0x01) & 0xFF;
        
        update = 1;
    } else if(aRxBuffer[2] == 0x21) {
        // two cups small
        aTxBuffer[7] = (aTxBuffer[7] + 0x01) & 0xFF;
        
        update = 1;
    } else {
        // reset
        lastBtn = 0;
    }

    if(update == 1) {
        // update the checksum before sending
        aTxBuffer[8] = checksum(aTxBuffer);

        lastBtn = 1;
    }


    if(1) {
    // output the rx and tx buffers:
    printf("[Delonghi] rcvd: ");

    int i;
    for(i = 0; i < DL_PACKETSIZE; i++) {
        printf("%02X", aRxBuffer[i]);
    }
    printf("  ");
    for(i = 0; i < DL_PACKETSIZE; i++) {
        printf("%02X", aTxBuffer[i]);
    }
    printf("\n");
}
}