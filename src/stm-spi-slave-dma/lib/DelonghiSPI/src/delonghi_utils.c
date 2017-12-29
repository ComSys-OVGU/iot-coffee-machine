#include "delonghi.h"
#include "delonghi_utils.h"

/* util functions, export */
void _dump_packet_size(uint8_t * packet, int size) {
  int i = 0;
  for (i = 0; i < size; i++) {
    printf("%02X", packet[i]);
  }
}

void _dump_packet(uint8_t * packet) {
  _dump_packet_size(packet, DL_PACKETSIZE);
}

uint8_t checksum(uint8_t * packet) {
  int sum = 0x55; // this is the start value delonghi uses

  int i = 0;
  for (; i < DL_PACKETSIZE - 1; i++) {
    sum = (sum + packet[i]) % 256;
  }
  return sum;
}

int checksumOK(uint8_t * packet) {
  return checksum(packet) == packet[DL_PACKETSIZE - 1];
}

void cpyPacket(uint8_t * src, uint8_t * dst) {
  int i;
  for (i = 0; i < DL_PACKETSIZE; i++) {
    dst[i] = src[i];
  }
}

/* /utils */