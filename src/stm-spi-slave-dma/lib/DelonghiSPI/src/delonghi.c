#include "delonghi.h"
#include "../../STM32F4-Discovery/src/stm32f4_discovery.h"

extern void _Error_Handler(char * , int);
#define Error_Handler() _Error_Handler(__FILE__, __LINE__)

void DL_Error_Handler(char * message);

/* Buffer used for transmission */
// This is the initial state
uint8_t aTxBuffer[] = {
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

/* Buffer used for reception */
uint8_t aRxBuffer[DL_PACKETSIZE];

int state = -1;

SPI_HandleTypeDef * DL_SPI_Handle;
void DL_Init(SPI_HandleTypeDef * spi_handle) {
  DL_SPI_Handle = spi_handle;

  printf("[Delonghi] Init'd\n");
}

void _DL_DMA_wait(void) {
  /* Wait for the end of the transfer */
  /*  Before starting a new communication transfer, you need to check the current
      state of the peripheral; if it's busy you need to wait for the end of current
      transfer before starting a new one.
      For simplicity reasons, this example is just waiting till the end of the
      transfer, but application may perform other tasks while transfer operation
      is ongoing. */
  while (HAL_SPI_GetState(DL_SPI_Handle) != HAL_SPI_STATE_READY) {
    // wait for DMA to signal that the transaction finished
  }
}

void DL_Sync(void) {
  state = 0; // starting to sync

  // first, sync to the 0xB0 Byte
  while (1) {
    // wait for one byte
    printf("[Delonghi] Sync: Waiting for 1 byte\n");
    if (HAL_SPI_TransmitReceive_DMA(DL_SPI_Handle, (uint8_t * ) aTxBuffer, (uint8_t * ) aRxBuffer, 1) != HAL_OK) {
      /* Transfer error in transmission process */
      DL_Error_Handler("Error while syncing (could not receive 1 byte)");
    }
    _DL_DMA_wait();

    if (aRxBuffer[0] == DL_PACKET_LCD_START) {
      BSP_LED_Toggle(LED3);
      // we found it, great!

      // wait for 8 other bytes, then exit
      if (HAL_SPI_TransmitReceive_DMA(DL_SPI_Handle, (uint8_t * ) aTxBuffer, (uint8_t * ) aRxBuffer, DL_PACKETSIZE - 1) != HAL_OK) {
        /* Transfer error in transmission process */
      DL_Error_Handler("Error while syncing (could not receive remaining 8 bytes)");
      }
      _DL_DMA_wait();

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

void DL_Start(void) {
  // note: this is busy-waiting for DMA transfers
  // and it might be better to handle this via callbacks
  while (1) {
    _DL_DMA_wait();
    BSP_LED_Toggle(LED4);

    if (HAL_SPI_TransmitReceive_DMA(DL_SPI_Handle, (uint8_t * ) aTxBuffer, (uint8_t * ) aRxBuffer, DL_PACKETSIZE) != HAL_OK) {
      /* Transfer error in transmission process */
      DL_Error_Handler("Error while running (could not receive packet)");
    }

    if (state == 1) {
      state = 2; // first packet sent and received
    }
  }
}

int lastBtn = 0;
void DL_TransferCompletedCB(void) {
  if (state < 2) {
    // not synced yet, exit
    return;
  }
  if (!checksumOK(aRxBuffer)) {
    // checksum wrong, exit
    printf("Expected cs 0x%02X got 0x%02X\n", aRxBuffer[8], checksum(aRxBuffer));
    // DL_Error_Handler("Wrong checksum\n");
  } else {

    // seems we've received a valid package
    // now to rev-eng the whole LCD we provide a debug mode
    // that uses 8 btns to increase the 8 bytes of the pwr-board response
    // also, the LCD-request and response is logged for debugging on USART1

    int update = 0;
    uint8_t btn = aRxBuffer[1];
    if (btn == DL_LCD_BTN_PWR) {
      // PWR BTN

      // reset everything to 0x00
      int i;
      for (i = 1; i < DL_PACKETSIZE - 1; i++) {
        aTxBuffer[i] = 0x00;
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
        || aRxBuffer[2] == DL_LCD_BTN_ONE_BIG_COFFEE
      )) {
      // repeated press, ignore for 10 more times
      // this allows you to press & hold a button
      // without going through all numbers way too fast
      if (lastBtn++ >= 10) {
        lastBtn = 0;
      }
    } else if (btn == DL_LCD_BTN_P) {
      // P btn
      aTxBuffer[1] = (aTxBuffer[1] + 0x01) & 0xFF;

      update = 1;

    } else if (btn == DL_LCD_BTN_FLUSH_WATER) {
      // flush_water btn
      aTxBuffer[2] = (aTxBuffer[2] + 0x01) & 0xFF;

      update = 1;

    } else if (btn == DL_LCD_BTN_HOT_WATER) {
      // hot_water btn
      aTxBuffer[3] = (aTxBuffer[3] + 0x01) & 0xFF;

      update = 1;

    } else if (btn == DL_LCD_BTN_OK) {
      // OK btn
      aTxBuffer[4] = (aTxBuffer[4] + 0x01) & 0xFF;

      update = 1;
    } else if (btn == DL_LCD_BTN_ONE_SMALL_COFFEE) {
      // one small coffee btn
      aTxBuffer[5] = (aTxBuffer[5] + 0x01) & 0xFF;

      update = 1;
    } else if (btn == DL_LCD_BTN_TWO_SMALL_COFFEES) {
      // two small coffees
      aTxBuffer[6] = (aTxBuffer[6] + 0x01) & 0xFF;

      update = 1;
    } else if (aRxBuffer[2] == DL_LCD_BTN_ONE_BIG_COFFEE) {
      // one big coffee btn
      aTxBuffer[7] = (aTxBuffer[7] + 0x01) & 0xFF;

      update = 1;
    } else {
      // reset
      lastBtn = 0;
    }

    if (update == 1) {
      // update the checksum before sending
      aTxBuffer[8] = checksum(aTxBuffer);

      lastBtn = 1;
    }
  }

  if (1) {
    // output the rx and tx buffers:
    printf("[Delonghi] rcvd: ");

    int i;
    for (i = 0; i < DL_PACKETSIZE; i++) {
      printf("%02X", aRxBuffer[i]);
    }
    printf("  ");
    for (i = 0; i < DL_PACKETSIZE; i++) {
      printf("%02X", aTxBuffer[i]);
    }
    printf("\n");
  }
}

void DL_Error_Handler(char * message) {
  printf("[Delonghi] Error: %s\n", message);
  Error_Handler();
}
