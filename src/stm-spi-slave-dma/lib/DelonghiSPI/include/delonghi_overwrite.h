/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef __DELONGHI_OVERWRITE_H
#define __DELONGHI_OVERWRITE_H

#include "delonghi.h"
#include <stdbool.h>

/* Type definitions ----------------------------------------------------------*/
typedef struct
{
    uint8_t buffer_packet[DL_PACKETSIZE];
    uint8_t buffer_and[DL_PACKETSIZE];
    uint8_t buffer_or[DL_PACKETSIZE];

    bool has_packet;
    bool has_and;
    bool has_or;
} DLO_Buffer;

void DLO_apply_overwrites(uint8_t* buffer, DLO_Buffer overwrites);

#endif /* __DELONGHI_OVERWRITE_H */
