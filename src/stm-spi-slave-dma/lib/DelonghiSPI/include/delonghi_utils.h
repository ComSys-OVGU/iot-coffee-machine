/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef __DELONGHI_UTILS_H
#define __DELONGHI_UTILS_H

#include "stdint.h"

void _dump_packet_size(uint8_t * packet, int size);
void _dump_packet(uint8_t * packet);
uint8_t checksum(uint8_t * packet);
int checksumOK(uint8_t * packet);
void cpyPacket(uint8_t * src, uint8_t * dst);

#endif /* __DELONGHI_UTILS_H */
