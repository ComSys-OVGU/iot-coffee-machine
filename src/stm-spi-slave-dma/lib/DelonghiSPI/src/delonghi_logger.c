#include "delonghi.h"
#include "delonghi_logger.h"
#include "delonghi_utils.h"

extern uint8_t DL_RxBuffer_LCD[DL_PACKETSIZE];
extern uint8_t DL_TxBuffer_LCD[DL_PACKETSIZE];
extern uint8_t DL_RxBuffer_PB[DL_PACKETSIZE];
extern uint8_t DL_TxBuffer_PB[DL_PACKETSIZE];

extern uint8_t DL_ChkCnt_LCD;
extern uint8_t DL_ChkCnt_PB;

uint8_t DLL_Last_RxBuffer_LCD[DL_PACKETSIZE];
uint8_t DLL_Last_RxBuffer_PB[DL_PACKETSIZE];
uint8_t DLL_LogMask_LCD[DL_PACKETSIZE];
uint8_t DLL_LogMask_PB[DL_PACKETSIZE];
bool DLL_LCD_enabled = false;
bool DLL_PB_enabled = false;

bool full_log_enabled = false;
bool poll_enabled = false;

// poll a single log
void DLL_Poll() {
  poll_enabled = true;
}

void DLL_Set_Debug(bool fle) {
  full_log_enabled = fle;
}

void DLL_Set_LCD_Enabled(bool lcd) {
  DLL_LCD_enabled = lcd;
}

void DLL_Set_PB_Enabled(bool pb) {
  DLL_PB_enabled = pb;
}

// NOTE: This is called on each iteration of state-machine; make this very performant
void DLL_Log(void) {
  bool should_log = false;

  if(full_log_enabled || poll_enabled) {
    should_log = true;
  } else {
    // see if log filter matched
    if(DLL_LCD_enabled) {
      // compare current buffer to last with mask applied
      uint8_t compare[DL_PACKETSIZE];
      cpyPacket(DL_RxBuffer_LCD, compare);
      apply_mask_and(compare, DLL_LogMask_LCD);

      int i;
      for(i = 0; i < DL_PACKETSIZE; i++) {
        if(DLL_Last_RxBuffer_LCD[i] != compare[i]) {
          should_log = true;
          break;
        }
      }

      // save current comapre buffer as last
      cpyPacket(compare, DLL_Last_RxBuffer_LCD);
    }
  }

  if(should_log) {
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
    
    poll_enabled = false;
  }

}