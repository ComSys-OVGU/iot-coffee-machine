#include "uart.h"
#include <delonghi.h>
#include <delonghi_utils.h>

uint8_t UART_Buffer[] = {
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};
int UART_Buffer_counter = 0;

typedef enum { 
  Command_Input = 0,
  Buffer_Input
} UART_State;
UART_State uart_state = Command_Input;

void UART_Handle_Command_Input(char input) {
  switch(input) {
    case 'd':
      printf("[UART] Disable Debug Output\n");
      DL_Set_Debug(0);
      break;
    case 'D':
      printf("[UART] Enable Debug Output\n");
      DL_Set_Debug(1);
      break;
    case 'b':
      printf("[UART] Input Buffer (%d chars)\n", DL_PACKETSIZE * 2);
      uart_state = Buffer_Input;
      break;
    case 'B':
      _UART_Dump_Buffer();
      break;
    case 'r':
      printf("[UART] Resetting...\n");
      NVIC_SystemReset();
      break;
    default:
      printf("[UART] Unknown command: '%c'\n", input);
      break;
  }
}

char char_to_hex(char input) {
  char num = input & 0x0F;
  if(input > '9') {
    num += 9;
  }
  return num;
}

void _UART_Dump_Buffer() {
  printf("[UART] Buffer set to ");
  _dump_packet(UART_Buffer);
  printf("\n");
}

void UART_Handle_Buffer_Input(char input) {
  if(UART_Buffer_counter < DL_PACKETSIZE * 2) {
    int idx = (UART_Buffer_counter % 2 == 0 ? UART_Buffer_counter : UART_Buffer_counter - 1) / 2;
    uint8_t curr_byte = UART_Buffer[idx];
    uint8_t in_byte = char_to_hex(input) & 0x0F;

    if(UART_Buffer_counter % 2 == 0) {
      curr_byte = (curr_byte & 0x0F) | in_byte << 4;
    } else {
      curr_byte = (curr_byte & 0xF0) | in_byte;
    }
    UART_Buffer[idx] = curr_byte;
    UART_Buffer_counter += 1;
  }
  if(UART_Buffer_counter >= DL_PACKETSIZE * 2) {
    _UART_Dump_Buffer();

    // reset state
    UART_Buffer_counter = 0;
    uart_state = Command_Input;
  }
}

void UART_Handle_RX(char input) {
  switch(uart_state) {
    case Command_Input:
      UART_Handle_Command_Input(input);
      break;
    case Buffer_Input:
      UART_Handle_Buffer_Input(input);
      break;
    default:
      break;
  }
}