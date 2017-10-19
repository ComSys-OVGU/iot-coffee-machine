#include "main.h"

/* Buffer used for transmission */
// uint8_t aTxBuffer[] = {0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00};
uint8_t aTxBuffer[] = {0x0B, 0x07, 0x00, 0x28, 0x0F, 0x20, 0x04, 0x00, 0xC2};

/* Buffer used for reception */
uint8_t aRxBuffer[BUFFERSIZE];

int state = -1;

void DL_Sync(void) {
    state = 0; // starting to sync
    // first, sync to the 0xB0 Byte
  while (1) {
    // wait for one byte
    if(HAL_SPI_TransmitReceive_DMA(&SpiHandle, (uint8_t*)aTxBuffer, (uint8_t *)aRxBuffer, 1) != HAL_OK)
    {
      /* Transfer error in transmission process */
      Error_Handler();
    }
    while (HAL_SPI_GetState(&SpiHandle) != HAL_SPI_STATE_READY)
    {
    }

    if(aRxBuffer[0] == 0xB0) {
      BSP_LED_Toggle(LED3);
      // we found it, great!
      
      // wait for 8 other bytes, then exit
      // wait for one byte
      if(HAL_SPI_TransmitReceive_DMA(&SpiHandle, (uint8_t*)aTxBuffer, (uint8_t *)aRxBuffer, 8) != HAL_OK)
      {
        /* Transfer error in transmission process */
        Error_Handler();
      }
      while (HAL_SPI_GetState(&SpiHandle) != HAL_SPI_STATE_READY)
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

    if(HAL_SPI_TransmitReceive_DMA(&SpiHandle, (uint8_t*)aTxBuffer, (uint8_t *)aRxBuffer, BUFFERSIZE) != HAL_OK)
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
    while (HAL_SPI_GetState(&SpiHandle) != HAL_SPI_STATE_READY)
    {
    }

    if(state == 1) {
        state = 2; // first packet sent and received
    }
  }
}

void DL_TransferCompletedCB(void) {
    // not synced yet, exit
    if(state < 2) {
        return;
    }
    if(!checksumOK(aRxBuffer)) {
        char* dbg = sprintf("packet: 0x%02X, calc: 0x%02X", aRxBuffer[8], checksum(aRxBuffer));
        printf(dbg);
        Error_Handler();
    }

    int update = 0;
    if(aRxBuffer[1] == 0x01) {
        // PWR BTN
        aTxBuffer[1] = 0x00;
        aTxBuffer[2] = 0x00;
        aTxBuffer[3] = 0x00;
        
        update = 1;
    } else if(aRxBuffer[1] == 0x20) {
        aTxBuffer[1] = (aTxBuffer[1] + 0x01) & 0xFF;
        
        update = 1;
    } else if(aRxBuffer[1] == 0x40) {
        aTxBuffer[2] = (aTxBuffer[2] + 0x01) & 0xFF;
        
        update = 1;
    } else if(aRxBuffer[1] == 0x80) {
        aTxBuffer[3] = (aTxBuffer[3] + 0x01) & 0xFF;
        
        update = 1;
    }

    if(update == 1) {
        // update the checksum before sending
        aTxBuffer[8] = checksum(aTxBuffer);
    }
}