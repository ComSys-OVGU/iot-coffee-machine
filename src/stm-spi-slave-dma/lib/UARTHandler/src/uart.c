#include "uart.h"
#include <delonghi.h>
#include <delonghi_logger.h>
#include <delonghi_utils.h>
#include <delonghi_overwrite.h>

extern DLO_Buffer DLO_Buffer_LCD;
extern DLO_Buffer DLO_Buffer_PB;
extern uint8_t DLL_LogMask_LCD[DL_PACKETSIZE];
extern uint8_t DLL_LogMask_PB[DL_PACKETSIZE];

uint8_t UART_Buffer[] = {
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};
int UART_Buffer_counter = 0;

typedef enum { 
  Command_Input = 0,
  Buffer_Input,
  Transfer_Target_Input,
  Reset_Target_Input
} UART_State;
UART_State uart_state = Command_Input;


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
  printf(" Checksum: %s\n", (checksumOK(UART_Buffer) ? "OK" : "NOK"));
}

void UART_Handle_Buffer_Input(char input) {
  if(!((input >= '0' && input <= '9') || (input >= 'a' && input <= 'f') || (input >= 'A' && input <= 'F'))) {
    // don't handle this char at all
    return;
  }
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

void UART_Handle_Transfer_Target_Input(char input) {
  switch(input) {
    case '0':
      cpyPacket(UART_Buffer, DLO_Buffer_LCD.buffer_packet);
      DLO_Buffer_LCD.has_packet = true;
      printf("[UART] Buffer copied to LCD:TX Packet.\n");
      break;
    case '1':
      cpyPacket(UART_Buffer, DLO_Buffer_LCD.buffer_and);
      DLO_Buffer_LCD.has_and = true;
      printf("[UART] Buffer copied to LCD:TX And.\n");
      break;
    case '2':
      cpyPacket(UART_Buffer, DLO_Buffer_LCD.buffer_or);
      DLO_Buffer_LCD.has_or = true;
      printf("[UART] Buffer copied to LCD:TX Or.\n");
      break;
    case '5':
      cpyPacket(UART_Buffer, DLO_Buffer_PB.buffer_packet);
      DLO_Buffer_PB.has_packet = true;
      printf("[UART] Buffer copied to PB:TX Packet.\n");
      break;
    case '6':
      cpyPacket(UART_Buffer, DLO_Buffer_PB.buffer_and);
      DLO_Buffer_PB.has_and = true;
      printf("[UART] Buffer copied to PB:TX And.\n");
      break;
    case '7':
      cpyPacket(UART_Buffer, DLO_Buffer_PB.buffer_or);
      DLO_Buffer_PB.has_or = true;
      printf("[UART] Buffer copied to PB:TX Or.\n");
      break;

    case '3':
      cpyPacket(UART_Buffer, DLL_LogMask_LCD);
      DLL_Set_LCD_Enabled(true);
      printf("[UART] Buffer copied to LCD:LogMask.\n");
      break;
    case '8':
      cpyPacket(UART_Buffer, DLL_LogMask_PB);
      DLL_Set_PB_Enabled(true);
      printf("[UART] Buffer copied to PB:LogMask.\n");
      break;
    default:
      printf("[UART] Unknown target.\n");      
      break;
  }
  uart_state = Command_Input;
}

void UART_Handle_Reset_Target_Input(char input) {
  switch(input) {
    case '0':
      DLO_Buffer_LCD.has_packet = false;
      printf("[UART] Reset LCD:TX Packet.\n");
      break;
    case '1':
      DLO_Buffer_LCD.has_and = false;
      printf("[UART] Reset LCD:TX And.\n");
      break;
    case '2':
      DLO_Buffer_LCD.has_or = false;
      printf("[UART] Reset LCD:TX Or.\n");
      break;
    case '5':
      DLO_Buffer_PB.has_packet = false;
      printf("[UART] Reset PB:TX Packet.\n");
      break;
    case '6':
      DLO_Buffer_PB.has_and = false;
      printf("[UART] Reset PB:TX And.\n");
      break;
    case '7':
      DLO_Buffer_PB.has_or = false;
      printf("[UART] Reset PB:TX Or.\n");
      break;
    default:
      printf("[UART] Unknown target.\n");      
      break;
  }
  uart_state = Command_Input;
}

void UART_Handle_Command_Input(char input) {
  switch(input) {
    case 'd':
      printf("[UART] Disable Debug Output\n");
      DLL_Set_Debug(false);
      break;
    case 'D':
      printf("[UART] Enable Debug Output\n");
      DLL_Set_Debug(true);
      break;
    case 'b':
      printf("[UART] Input Buffer (%d chars)\n", DL_PACKETSIZE * 2);
      uart_state = Buffer_Input;
      break;
    case 'B':
      _UART_Dump_Buffer();
      break;
    case 't':
      printf("[UART] Transfer Buffer:\n0\tLCD:TX Packet\n1\tLCD:TX And\n2\tLCD:TX Or\n5\tPB:TX Packet\n6\tPB:TX And\n7\tPB:TX Or\n");
      uart_state = Transfer_Target_Input;
      break;
    case 'T':
      printf("[UART] Reset Overwrite:\n0\tLCD:TX Packet\n1\tLCD:TX And\n2\tLCD:TX Or\n5\tPB:TX Packet\n6\tPB:TX And\n7\tPB:TX Or\n");
      uart_state = Reset_Target_Input;
      break;
    case 'a': {
      DLO_Buffer DLO_Buffer_Test = {{0x00},{0x00},{0x00}, false, false, false};
      uint8_t SRC_Buffer_Test_Packet[] = {
        0xFF, 0x55, 0xAA, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      };
      uint8_t SRC_Buffer_Test_And[] = {
        0xFF, 0x55, 0xAA, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      };
      uint8_t SRC_Buffer_Test_Or[] = {
        0xFF, 0x55, 0xAA, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      };
      cpyPacket(SRC_Buffer_Test_Packet, DLO_Buffer_Test.buffer_packet);
      cpyPacket(SRC_Buffer_Test_And, DLO_Buffer_Test.buffer_and);
      cpyPacket(SRC_Buffer_Test_Or, DLO_Buffer_Test.buffer_or);
      
      DLO_Buffer_Test.has_and = true;
      DLO_Buffer_Test.has_or = true;

      uint8_t DL_Buffer_Test_Packet[] = {
        0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF, 0x01, 0x23, 0x45
      };
      uint8_t DL_Buffer_Test_And[] = {
        0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
      };
      uint8_t DL_Buffer_Test_Or[] = {
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
      };

      DLO_Buffer_Test.has_packet = true;
      DLO_Buffer_Test.has_and = false;
      DLO_Buffer_Test.has_or = false;
      DLO_apply_overwrites(DL_Buffer_Test_Packet, DLO_Buffer_Test);

      DLO_Buffer_Test.has_packet = false;
      DLO_Buffer_Test.has_and = true;
      DLO_Buffer_Test.has_or = false;
      DLO_apply_overwrites(DL_Buffer_Test_And, DLO_Buffer_Test);

      DLO_Buffer_Test.has_packet = false;
      DLO_Buffer_Test.has_and = false;
      DLO_Buffer_Test.has_or = true;
      DLO_apply_overwrites(DL_Buffer_Test_Or, DLO_Buffer_Test);

      printf("[UART] Applied buffer Packet: ");
      _dump_packet(DL_Buffer_Test_Packet);
      printf(" And: ");
      _dump_packet(DL_Buffer_Test_And);
      printf(" Or: ");
      _dump_packet(DL_Buffer_Test_Or);
      printf("\n");
      break;
    }
    case 'r':
      printf("[UART] Resetting...\n");
      NVIC_SystemReset();
      break;

    case 'p':
      DLL_Poll();
      break;

    case '\n':
    case '\r':
      break;
    default:
      printf("[UART] Unknown command: '%c'\n", input);
      break;
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
    case Transfer_Target_Input:
      UART_Handle_Transfer_Target_Input(input);
      break;
    case Reset_Target_Input:
      UART_Handle_Reset_Target_Input(input);
      break;
    default:
      break;
  }
}