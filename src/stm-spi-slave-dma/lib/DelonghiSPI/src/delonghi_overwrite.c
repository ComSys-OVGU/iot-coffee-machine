#include "delonghi_overwrite.h"
#include "delonghi_utils.h"

DLO_Buffer DLO_Buffer_PB = {{0x00},{0x00},{0x00}, false, false, false};
DLO_Buffer DLO_Buffer_LCD = {{0x00},{0x00},{0x00}, false, false, false};

void DLO_apply_overwrites(uint8_t* buffer, DLO_Buffer overwrites) {
  int i;
  if(overwrites.has_packet) {
    cpyPacket(overwrites.buffer_packet, buffer);
  } else {
    if(overwrites.has_and) {
      for(i = 0; i < DL_PACKETSIZE; i++) {
        buffer[i] = buffer[i] & overwrites.buffer_and[i];
      }
    }

    if(overwrites.has_or) {
      for(i = 0; i < DL_PACKETSIZE; i++) {
        buffer[i] = buffer[i] | overwrites.buffer_or[i];
      }
    }
  }

  // if anything was set; re-calc the checksum
  if(overwrites.has_packet || overwrites.has_and || overwrites.has_or) {
    buffer[DL_PACKETSIZE-1] = checksum(buffer);
  }
}
