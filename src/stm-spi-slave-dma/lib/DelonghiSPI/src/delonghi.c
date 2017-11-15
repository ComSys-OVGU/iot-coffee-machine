#include "delonghi.h"
#include "../../STM32F4-Discovery/src/stm32f4_discovery.h"

extern void _Error_Handler(char * , int);
#define Error_Handler() _Error_Handler(__FILE__, __LINE__)

void DL_Error_Handler(char * message);
void _DL_Debug_LCD(void);

/* Buffers used for transmission */
uint8_t DL_Buffer_Sync[] = {
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00
};

// This is the initial state
uint8_t DL_TxBuffer_PB[] = {
  0xB0,
  0x00,
  0x20,
  0x06,
  0x07,
  0x02,
  0x0D,
  0x80,
  0xC1
};
uint8_t DL_TxBuffer_LCD[] = {
  0x0B,
  0x07,
  0x00,
  0x28,
  0x0F,
  0x20,
  0x04,
  0x00,
  0xC2
};


/* Buffers used for reception */
uint8_t DL_RxBuffer_PB[DL_PACKETSIZE];
uint8_t DL_RxBuffer_LCD[DL_PACKETSIZE];

/* Checksum err counters */
uint8_t DL_ChkCnt_PB = 0;
uint8_t DL_ChkCnt_LCD = 0;

typedef enum { 
  Unknown = -1,
  Inited,

  Syncing_PB,
  Syncing_LCD,

  Synced_PB,
  Synced_LCD,

  Idle, // 5

  Communicate_LCD, 
  Communicating_LCD,
  Communicated_LCD,

  Communicate_PB,
  Communicating_PB,
  Communicated_PB,

  DBG_Halt
} DL_State;

DL_State state = Unknown;

SPI_HandleTypeDef * DL_SPI_Handle_PB;
SPI_HandleTypeDef * DL_SPI_Handle_LCD;

/* util functions, export */
static void _dump_packet_size(uint8_t * packet, int size) {
  int i = 0;
  for (i = 0; i < size; i++) {
    printf("%02X", packet[i]);
  }
}

static void _dump_packet(uint8_t * packet) {
  _dump_packet_size(packet, DL_PACKETSIZE);
}

static uint8_t checksum(uint8_t * packet) {
  int sum = 0x55; // this is the start value delonghi uses

  int i = 0;
  for (; i < 8; i++) {
    sum = (sum + packet[i]) % 256;
  }
  return sum;
}

static int checksumOK(uint8_t * packet) {
  return checksum(packet) == packet[8];
}

static void cpyPacket(uint8_t * src, uint8_t * dst) {
  int i;
  for (i = 0; i < DL_PACKETSIZE; i++) {
    dst[i] = src[i];
  }
}

/* /utils */


void DL_Init(SPI_HandleTypeDef * spi_handle_pb, SPI_HandleTypeDef * spi_handle_lcd) {
  DL_SPI_Handle_PB = spi_handle_pb;
  DL_SPI_Handle_LCD = spi_handle_lcd;

  state = Inited;

  printf("[Delonghi] Init'd\n");
}

void _DL_DMA_wait(SPI_HandleTypeDef * spi_handle) {
  /* Wait for the end of the transfer */
  /*  Before starting a new communication transfer, you need to check the current
      state of the peripheral; if it's busy you need to wait for the end of current
      transfer before starting a new one.
      For simplicity reasons, this example is just waiting till the end of the
      transfer, but application may perform other tasks while transfer operation
      is ongoing. */
  BSP_LED_On(LED_Orange);
  while (HAL_SPI_GetState(spi_handle) != HAL_SPI_STATE_READY) {
    // wait for DMA to signal that the transaction finished
  }
  BSP_LED_Off(LED_Orange);
}

typedef enum { 
  Sync_First = 0,
  Sync_Rest,
  LCD,
  PB
} DL_DMA_MODE;

HAL_StatusTypeDef _DL_DMA_Transfer(SPI_HandleTypeDef * spi_handle, uint8_t *pTxData, uint8_t *pRxData, uint16_t size, DL_DMA_MODE mode) {
  switch (mode) {
    case Sync_First:
      // send a single byte, discarding the txBuffer and sending 0x00 instead
      return HAL_SPI_TransmitReceive_DMA(spi_handle, pTxData, pRxData, 1);
    case Sync_Rest:
      if(spi_handle == DL_SPI_Handle_LCD) {
        // Fortunately, we've already implemented this below so just wrap the function
        return _DL_DMA_Transfer(spi_handle, pTxData, pRxData, size, LCD);
      } else {
        // Fortunately, we've already implemented this below so just wrap the function
        return _DL_DMA_Transfer(spi_handle, pTxData, pRxData, size, PB);
      }
      break;
    case LCD:
      // for the LCD, it's very simple, just send the data as we are asked (LCD is Master) and all is well
      return HAL_SPI_TransmitReceive_DMA(spi_handle, pTxData, pRxData, size);
    case PB: {
      // for the PB, it's a bit more complicated. As the PB does not like to receive all bytes at once
      //  but rather delayed by 2.5ms each, we need to send them out one-by-one (DMA ftw...)
      int i;
      HAL_StatusTypeDef status;

      // printf("Sending to PB: ");
      // _dump_packet_size(pTxData, size);
      // printf("  ");
      for(i = 0; i < size; i++) {
        status = HAL_SPI_TransmitReceive_DMA(spi_handle, pTxData + i, pRxData + i, 1);
        if(status != HAL_OK) {
          // printf("\n");
          return status;
        }

        _DL_DMA_wait(DL_SPI_Handle_PB);
        // wait a minimal amount of time (in fact about 1.9ms) before sending the next byte
        //  if this is skipped, the PB will not be able to process the data correctly
        // actually, even 0 works but this might not be very descriptive so delay for 1ms between bytes
        HAL_Delay(1);
      }
      // printf("\n");
      return status;
    }
  }

  return HAL_ERROR;
}

void _DL_Sync_LCD(void) {
  state = Syncing_LCD; // starting to sync

  // first, sync to the 0xB0 Byte
  while (1) {
    // wait for one byte
    printf("[Delonghi] Sync_LCD: Waiting for 1 byte\n");
    if (HAL_SPI_TransmitReceive_DMA(DL_SPI_Handle_LCD, (uint8_t * ) DL_Buffer_Sync, (uint8_t * ) DL_RxBuffer_LCD, 1) != HAL_OK) {
      /* Transfer error in transmission process */
      DL_Error_Handler("Error while syncing with LCD (could not receive 1 byte)");
    }
    _DL_DMA_wait(DL_SPI_Handle_LCD);

    if (DL_RxBuffer_LCD[0] == DL_PACKET_LCD_START) {
      BSP_LED_Toggle(LED_Orange);
      // we found it, great!

      // wait for 8 other bytes, then exit
      if (HAL_SPI_TransmitReceive_DMA(DL_SPI_Handle_LCD, (uint8_t * ) DL_Buffer_Sync, (uint8_t * ) DL_RxBuffer_LCD + 1, DL_PACKETSIZE - 1) != HAL_OK) {
        /* Transfer error in transmission process */
        DL_Error_Handler("Error while syncing with LCD (could not receive remaining 8 bytes)");
      }
      _DL_DMA_wait(DL_SPI_Handle_LCD);

      if(checksumOK(DL_RxBuffer_LCD)) {
        BSP_LED_Toggle(LED_Orange);
        break;
      } else {
        printf("[Delonghi] Invalid cs in sync with LCD, trying again...");
      }
    } else {
      // toggle blue led to indicate waiting status
      BSP_LED_Toggle(LED_Blue);
    }
  }
  BSP_LED_Off(LED_Blue);
  BSP_LED_Off(LED_Orange);
  state = Synced_LCD; // synced

  printf("[Delonghi] Sync'd with LCD\n");
}

void _DL_Sync_PB(void) {
  // first, sync to the 0xB0 Byte
  while (1) {
    // wait for one byte
    printf("[Delonghi] Sync_PB: Waiting for 1 byte\n");
    if (_DL_DMA_Transfer(DL_SPI_Handle_PB, (uint8_t *)DL_Buffer_Sync, (uint8_t *)DL_RxBuffer_PB, 1, Sync_First) != HAL_OK)
    {
      /* Transfer error in transmission process */
      DL_Error_Handler("Error while syncing with PB (could not receive 1 byte)");
    }
    _DL_DMA_wait(DL_SPI_Handle_PB);

    if (DL_RxBuffer_PB[0] == DL_PACKET_PB_START) {
      // BSP_LED_Toggle(LED_Orange);
      // we found it, great!
      //  the PB does not need to send a whole packet to be in sync, 
      //  as we are the master and we control the clock
      break;
    } else {
      // toggle blue led to indicate waiting status
      // BSP_LED_Toggle(LED_Blue);
      // only wait in case we did not exit before
      HAL_Delay(1);
    }

  }
  // BSP_LED_Off(LED_Blue);
  // BSP_LED_Off(LED_Orange);

  printf("[Delonghi] Sync'd with PB: ");
  _dump_packet_size(DL_RxBuffer_PB, 1);
  printf("\n");
}

void DL_Sync(void) {
  // debug: only communicate with PB
  const uint8_t PB_ONLY = 0;

  if (PB_ONLY) {
    _DL_Sync_PB();
  }

  while (PB_ONLY) {
    HAL_Delay(250);
    BSP_LED_Toggle(LED_Green);

    if (_DL_DMA_Transfer(DL_SPI_Handle_PB, (uint8_t * ) DL_TxBuffer_PB, (uint8_t * ) DL_RxBuffer_PB, DL_PACKETSIZE, PB) != HAL_OK) {
      /* Transfer error in transmission process */
      DL_Error_Handler("Error while transferring data with PB");
    }


    printf("PB:TX=");
    _dump_packet(DL_TxBuffer_PB);
    printf("  PB:RX=");
    _dump_packet(DL_RxBuffer_PB);
    printf(" (CS=%s)\n", (checksumOK(DL_RxBuffer_PB)?"OK":"NOK"));
  }

  while (PB_ONLY) { /*block*/ }
}

void DL_Start(void) {
  // note: this is busy-waiting for DMA transfers
  // and it might be better to handle this via callbacks

  // this should be enough to trigger on
  BSP_LED_Off(LED_Red);
  BSP_LED_On(LED_Red);
  BSP_LED_Off(LED_Red);

  BSP_LED_Off(LED_Green);
  BSP_LED_Off(LED_Orange);
  BSP_LED_Off(LED_Blue);

  while (1) {
    // printf("[Delonghi] Running State %d\n", state);
    BSP_LED_Toggle(LED_Blue);

    switch (state) {
    case Inited:            // 0
      // first, sync to the PB
      state = Syncing_PB;
      break;

    case Syncing_PB:        // 1
      // note that this is blocking and we only continue once sync is done
      _DL_Sync_PB();

      state = Synced_PB;
      break;

    case Synced_PB:         // 2
      // next, sync to the LCD
      state = Syncing_LCD;
      break;

    case Syncing_LCD:       // 3
      // note that this is blocking and we only continue once sync is done
      _DL_Sync_LCD();

      state = Synced_LCD;
      break;

    case Synced_LCD:        // 4
      // we're done syncing, so basically we've just received a valid package from the LCD
      // this is why the next state is Communicated_LCD instead of Idle

      state = Communicated_LCD;
      break;

    case Idle:              // 5
      // when idle, start the transfer with the LCD board

      if(1) {
        // this should be enough to trigger the scope
        BSP_LED_Off(LED_Red);
        BSP_LED_On(LED_Red);
        BSP_LED_Off(LED_Red);
      }

      // send data to the LCD
      state = Communicate_LCD;
      break;

    case Communicate_LCD:   // 6
      // make sure to update the state *before* sending
      //  otherwise a very fast transfer might screw up our state machine
      //  because the DMA CB would not run correctly
      state = Communicating_LCD;

      // BSP_LED_Toggle(LED_Green);

      // make sure we don't re-use the old buffer
      cpyPacket(DL_Buffer_Sync, DL_RxBuffer_LCD);

      if (HAL_SPI_TransmitReceive_DMA(DL_SPI_Handle_LCD, (uint8_t *)DL_TxBuffer_LCD, (uint8_t *)DL_RxBuffer_LCD, DL_PACKETSIZE) != HAL_OK)
      {
        /* Transfer error in transmission process */
        DL_Error_Handler("Error while running (could not receive packet)");
      }

      // this will, in fact, eat up a LOT of time
      //  because the transfer takes forever 
      //  (as the LCD board only sends data as fast as the PB wants to receive)
      _DL_DMA_wait(DL_SPI_Handle_LCD);

      // BSP_LED_Toggle(LED_Green);
      break;

    case Communicating_LCD: // 7
      // the state will be left from the DMA transfer CB
      // thus we stay in the current state if nothing else happens
      break;

    case Communicated_LCD:  // 8
      // state = Idle; // rerun Idle
      // return;

      if (!checksumOK(DL_RxBuffer_LCD))
      {
        // checksum wrong, exit
        printf("LCD:Rx=");
        _dump_packet(DL_RxBuffer_LCD);
        printf("\n");

        printf("Expected cs 0x%02X got 0x%02X\n", checksum(DL_RxBuffer_LCD), DL_RxBuffer_LCD[8]);

        // show that we've received an error along the way but don't stop processing
        // BSP_LED_On(LED_Red);
        // BSP_LED_On(LED_Blue);

        DL_ChkCnt_LCD += 1;
        // DL_Error_Handler("Wrong checksum\n");
      }
      else if (0)
      {
        // run the interactive debug program
        _DL_Debug_LCD();
      }
      else if (1)
      {
        // copy received state (from LCD) to send buffer (to PB)
        cpyPacket(DL_RxBuffer_LCD, DL_TxBuffer_PB);
      }

      state = Communicate_PB;

      break;

    case Communicate_PB:    // 9
      // send the current LCD-state to the PB and store the received PB-state
      if (_DL_DMA_Transfer(DL_SPI_Handle_PB, (uint8_t *)DL_TxBuffer_PB, (uint8_t *)DL_RxBuffer_PB, DL_PACKETSIZE, PB) != HAL_OK)
      {
        /* Transfer error in transmission process */
        DL_Error_Handler("Error while transferring data with PB");
      }

      // NOTE: we are not waiting for this DMA to finish.
      // If the PB does not respond in time,
      //  the LCD will re-send the data, hopefully.

      state = Communicated_PB;
      break;

    case Communicating_PB:  // 10
      // TODO: this is unused right now
      break;

    case Communicated_PB:   // 11
      if (!checksumOK(DL_RxBuffer_PB)) {
        // checksum wrong
        printf("PB:Rx=");
        _dump_packet(DL_RxBuffer_PB);
        printf("\n");

        printf("Expected cs 0x%02X from PB got 0x%02X\n", checksum(DL_RxBuffer_PB), DL_RxBuffer_PB[8]);

        // show that we've received an error along the way but don't stop processing
        // BSP_LED_On(LED_Red);
        // BSP_LED_On(LED_Blue);

        DL_ChkCnt_PB += 1;
        // DL_Error_Handler("Wrong checksum from PB\n");
      } else {
        // copy received state (from PB) to send buffer (to LCD)
        cpyPacket(DL_RxBuffer_PB, DL_TxBuffer_LCD);
      }
      BSP_LED_Toggle(LED_Green);
      if (1) {
        // output the rx and tx buffers:
        printf("[Delonghi] LCD:RX=");
        _dump_packet(DL_RxBuffer_LCD);
        printf(" -> PB:TX=");
        _dump_packet(DL_TxBuffer_PB);
        printf("  PB:RX=");
        _dump_packet(DL_RxBuffer_PB);
        printf(" -> LCD:TX=");
        _dump_packet(DL_TxBuffer_LCD);
        printf(" LCD:CSE=%d PB:CSE=%d\n", DL_ChkCnt_LCD, DL_ChkCnt_PB);
      }
      BSP_LED_Toggle(LED_Green);
      // we are done with the cycle, so go back to Idle in the next loop
      state = Idle;
      break;

    case DBG_Halt:
      BSP_LED_On(LED_Green);
      BSP_LED_On(LED_Orange);
      BSP_LED_On(LED_Red);
      BSP_LED_On(LED_Blue);
    default:
      printf("[Delonghi] Unknown state, halting.\n");
      while (1) {}
    }
  }
}


void DL_TransferCompletedCB(SPI_HandleTypeDef * spi_handle) {
  if (spi_handle != DL_SPI_Handle_LCD) {
    // do not handle PB SPI CB
    return;
  }
  if (state != Communicating_LCD) {
    printf("[Delonghi] DMA finished in invalid state.\n");
    // not synced yet, exit
    return;
  }
  
  // we are done comm'ing with the LCD
  state = Communicated_LCD;
  // printf("[Delonghi] DMA finished in valid state.\n");
}

void DL_Error_Handler(char * message) {
  printf("[Delonghi] Error: %s\n", message);
  Error_Handler();
}

int lastBtn = 0;
void _DL_Debug_LCD(void) {
  // BSP_LED_Off(LED_Red);

  // seems we've received a valid package
  // now to rev-eng the whole LCD we provide a debug mode
  // that uses 8 btns to increase the 8 bytes of the pwr-board response
  // also, the LCD-request and response is logged for debugging on USART1

  int update = 0;
  uint8_t btn = DL_RxBuffer_LCD[1];
  if (btn == DL_LCD_BTN_PWR) {
    // PWR BTN

    // reset everything to 0x00
    int i;
    for (i = 1; i < DL_PACKETSIZE - 1; i++) {
      DL_TxBuffer_LCD[i] = 0x00;
    }

    update = 1;
  } else if (lastBtn != 0 && (
      btn == DL_LCD_BTN_P
      || btn == DL_LCD_BTN_FLUSH_WATER
      || btn == DL_LCD_BTN_HOT_WATER
      || btn == DL_LCD_BTN_OK
      || btn == DL_LCD_BTN_ONE_SMALL_COFFEE
      || btn == DL_LCD_BTN_TWO_SMALL_COFFEES
      // note that the big coffee btn is set in a different byte
      || DL_RxBuffer_LCD[2] == DL_LCD_BTN_ONE_BIG_COFFEE
    )) {
    // repeated press, ignore for 10 more times
    // this allows you to press & hold a button
    // without going through all numbers way too fast
    if (lastBtn++ >= 10) {
      lastBtn = 0;
    }
  } else if (btn == DL_LCD_BTN_P) {
    // P btn
    DL_TxBuffer_LCD[1] = (DL_TxBuffer_LCD[1] + 0x01) & 0xFF;

    update = 1;

  } else if (btn == DL_LCD_BTN_FLUSH_WATER) {
    // flush_water btn
    DL_TxBuffer_LCD[2] = (DL_TxBuffer_LCD[2] + 0x01) & 0xFF;

    update = 1;

  } else if (btn == DL_LCD_BTN_HOT_WATER) {
    // hot_water btn
    DL_TxBuffer_LCD[3] = (DL_TxBuffer_LCD[3] + 0x01) & 0xFF;

    update = 1;

  } else if (btn == DL_LCD_BTN_OK) {
    // OK btn
    DL_TxBuffer_LCD[4] = (DL_TxBuffer_LCD[4] + 0x01) & 0xFF;

    update = 1;
  } else if (btn == DL_LCD_BTN_ONE_SMALL_COFFEE) {
    // one small coffee btn
    DL_TxBuffer_LCD[5] = (DL_TxBuffer_LCD[5] + 0x01) & 0xFF;

    update = 1;
  } else if (btn == DL_LCD_BTN_TWO_SMALL_COFFEES) {
    // two small coffees
    DL_TxBuffer_LCD[6] = (DL_TxBuffer_LCD[6] + 0x01) & 0xFF;

    update = 1;
  } else if (DL_RxBuffer_LCD[2] == DL_LCD_BTN_ONE_BIG_COFFEE) {
    // one big coffee btn
    DL_TxBuffer_LCD[7] = (DL_TxBuffer_LCD[7] + 0x01) & 0xFF;

    update = 1;
  } else {
    // reset
    lastBtn = 0;
  }

  if (update == 1) {
    // update the checksum before sending
    DL_TxBuffer_LCD[8] = checksum(DL_TxBuffer_LCD);

    lastBtn = 1;
  }
}
